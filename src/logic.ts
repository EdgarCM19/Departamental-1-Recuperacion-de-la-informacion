import { ErrorCodes } from "@vue/runtime-core";

const stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", 
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", 
    "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", 
    "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
    "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
    "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they",
    "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", 
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", 
    "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];

function deleteStopWords(text: string): string{ 
    let temp_text: string = text;
    stop_words.forEach(x => {
        const re = new RegExp('\\b' + x + '\\b\\s*', 'g'); // eslint-disable-line
        temp_text = temp_text.replaceAll(re, '');
    });
    return temp_text;
}

// const stemmer_rules = [
//     ['sses', 'ss'],
//     ['ies', 'i'],
//     ['s', ''],
// ];

// function stemmer(text: string): string {
//     let temp_text = text;
//     stemmer_rules.forEach(x => {
//         const [rule, replace] = x;
//         const re = new RegExp(rule + '\\b', 'g');
//         temp_text = temp_text.replaceAll(re, replace);   
//     });
//     return temp_text;
// }

class PorterStemmer {

    private isCons(letter: string): boolean {
        if(letter === 'a' || letter === 'e' || letter === 'i' || 
                letter === 'o' || letter === 'u') return false;
        return true;
    }

    private isConsonant(word: string, index: number): boolean {
        const letter = word.charAt(index);
        if(this.isCons(letter))
            if(letter === 'y' && this.isCons(word.charAt(index - 1)))
                return false;
            else 
                return true;
        else return false;
    }

    private isVowel(word: string, index: number): boolean {
        return !this.isConsonant(word, index);
    }

    private containsVowel(stem: string): boolean {
        for(const c of stem)
            if(!this.isCons(c)) return true;
        return false;
    }

    private doubleCons(stem: string): boolean {
        if(stem.length < 2) return false;
        return this.isConsonant(stem, stem.length - 1) && 
                this.isConsonant(stem, stem.length - 2);
    }

    private getForm(word: string): string {
        const form: string[] = [];
        for(let i = 0; i < word.length; i++){
            if(this.isConsonant(word, i)){
                if(i !== 0)
                    if(form[form.length - 1] !== 'C')
                        form.push('C');
                else
                    form.push('C');
            } else { 
                if(i !== 0)
                    if(form[form.length -1] !== 'V')
                        form.push('V');
                else 
                    form.push('V');
            }
        }
        return form.join('');
    }

    private getM(word: string): number {
        const form = this.getForm(word);
        const re = new RegExp('/VC/', 'g');
        // const result = (form.match(re) || []).length;
        // return result;
        return form.split(re).length;
    }

    private cvc(word: string): boolean {
        if(word.length < 3) return false;
        const f = word.length - 3;
        const s = word.length - 2;
        const t = word.length - 1;
        const third = word.charAt(t);
        if(this.isConsonant(word, f) && this.isVowel(word, s) && this.isConsonant(word, t))
            return (third !== 'w' && third !== 'x' && third !== 'y');
        return false;

    }

    private replaceM0(original: string, replaceable: string, replace: string): string {
        const index = original.lastIndexOf(replaceable);
        const base = original.slice(0, index);
        if(this.getM(base) > 0)
            return original.replace(replaceable, replace);
        return original;
    }

    private replaceM1(original: string, replaceable: string, replace: string){
        const index = original.lastIndexOf(replaceable);
        const base = original.slice(index);
        if(this.getM(base) > 1)
            return base + replace;
        return original;
    }


    private step1a(word: string): string {
        let temp = word;
        const stemmer_rules = [
            ['sses', 'ss'],
            ['ies', 'i'],
            ['s', ''],
        ];
        stemmer_rules.forEach(x => {
            const [rule, replace] = x;
            const re = new RegExp(rule + '\\b', 'g');
            temp = temp.replace(re, replace);
        });
        return temp;
    }
    
    private step1b(word: string): string {
        let temp = word;
        let flag = false;
        if(word.endsWith('eed')){
            const index = word.lastIndexOf('eed');
            const base = word.slice(0, index);
            if(this.getM(base) > 0){
                temp = base + 'ee';
            }
        } else if(word.endsWith('ed')){
            const index = word.lastIndexOf('ed');
            const base = word.slice(0, index);
            if(this.containsVowel(base)){
                temp = base;
                flag = true;
            }
        } else if(word.endsWith('ing')){
            const index = word.lastIndexOf('ing');
            const base = word.slice(0, index);
            if(this.containsVowel(base)){
                temp = base;
                flag = true;
            }
        }

        if(flag){
            if(temp.endsWith('at') || temp.endsWith('bl') || temp.endsWith('iz')) temp += 'e';
            else if(this.doubleCons(temp) && !temp.endsWith('l') && !temp.endsWith('s') && !temp.endsWith('z')) temp = temp.slice(0, temp.length - 1);
            else if(this.getM(temp) === 1 && this.cvc(temp)) temp += 'e';
        }
        return temp;
    }

    private step1c(word: string): string {
        let temp = word;
        if(temp.endsWith('y')){
            const index = temp.lastIndexOf('y');
            const base = temp.slice(index);
            if(this.containsVowel(base)) temp = base + 'i';
        }
        return temp;
    }

    private step1(text: string): string {
        let temp = text;
        temp = this.step1a(temp);
        temp = this.step1b(temp);
        temp = this.step1c(temp);
        return temp;
    }

    private step2(word: string): string {
        let temp = word;
        const rules = [
            ['ational', 'ate'],
            ['tional', 'tion'],
            ['enci', 'ence'],
            ['anci', 'ance'],
            ['izer', 'ize'],
            ['abli', 'able'],
            ['alli', 'al'],
            ['entli', 'ent'],
            ['eli', 'e'],
            ['ousli', 'ous'],
            ['ization', 'ize'],
            ['ation', 'ate'],
            ['ator', 'ate'],
            ['alism', 'al'],
            ['iveness', 'ive'],
            ['fulness', 'ful'],
            ['ousness', 'oue'],
            ['atili', 'al'],
            ['iviti', 'ive'],
            ['biliti', 'ble']
        ];
        rules.forEach(x => {
            const [rule, replace] = x;
            if(temp.endsWith(rule))
               temp = this.replaceM0(temp, rule, replace);  
        });
        return temp;
    }

    private step3(word: string): string{
        let temp = word;
        const rules = [
            ['icate', 'ic'],
            ['ative', ''],
            ['alize', 'al'],
            ['iciti', 'ic'],
            ['ful', ''],
            ['ness', ''],
        ];
        rules.forEach(x => {
            const [rule, replace] = x;
            if(temp.endsWith(rule))
               return temp = this.replaceM0(temp, rule, replace);  
        });
        return temp;
    }

    private step4(word: string): string{
        let temp = word;
        const rules = ['al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement', 'ment', 'ent', 'ou', 'ism', 'ate', 
                'iti', 'ous', 'ive', 'ize'];
        rules.forEach(rule => {
            if(temp.endsWith(rule))
               return temp = this.replaceM1(temp, rule, '');  
        });
        if(temp.endsWith('ion')){
            const index = temp.lastIndexOf('ion');
            const base = temp.slice(0, index);
            if(this.getM(base) > 1 && base.endsWith('s') || base.endsWith('t')) 
                temp = base;
        }
        return temp;
    }

    private step5a(word: string): string {
        let temp = word;
        if(word.endsWith('e')){
            const base = temp.slice(0, temp.length - 1);
            if(this.getM(base) > 1)
                temp = base;
        }
        return temp;
    }

    private step5b(word: string): string {
        let temp = word;
        if(this.getM(temp) > 1 && this.doubleCons(temp) && temp.endsWith('l'))
            temp = temp.slice(0, temp.length - 1);
        return temp;
    }

    private step5(word: string): string {
        let temp = word;
        temp = this.step5a(temp);
        temp = this.step5b(temp);
        return temp;
    }

    public steem(text: string): string {
        const temp = text.split(' '); 
        let final = '';
        temp.map(x => {
            x = x.toLowerCase();
            x = this.step1(x);
            x = this.step2(x);
            x = this.step3(x);
            x = this.step4(x);
            x = this.step5(x);
            final += `${x} `;
        }).join(' ');
        console.log(final);
        return final;
    }

}

export { deleteStopWords, PorterStemmer};