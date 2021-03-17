<template>
  <nav>
    <h3>Departamental 1</h3>
    <InputFile
      @load="loadText"
      :placeholder="'Seleccione un archivo'"></InputFile>
  </nav>
  <textarea v-model="text" readonly></textarea>
  <div class="action-buttons">
    <Button :on_click_fn="analisisLexico" :disabled="activeButtons.lexico">Analisis Lexico</Button>
    <Button :on_click_fn="eliminacion" :disabled="activeButtons.cerradas">Eliminacion de palabras</Button>
    <Button :on_click_fn="truncamiento" :disabled="activeButtons.truncamiento">Truncamiento</Button>
  </div>
  <!-- <div>{{text}}</div> -->
  <div class="team">
    <div class="integrante">
      <div class="nombre">Castro Martinez Edgar</div>
      <div class="matricula">201748214</div>
    </div>
    <div class="integrante">
      <div class="nombre">Hernandez Cervantes Mariana</div>
      <div class="matricula">201740053</div>
    </div>
    <div class="integrante">
      <div class="nombre">Lopez Romero Diana</div>
      <div class="matricula">201766874</div>
    </div>
    <div class="integrante">
      <div class="nombre">Otlica Rosalino Jesus</div>
      <div class="matricula">201758692</div>
    </div>
    <div class="integrante">
      <div class="nombre">Salazar Romero Nelly</div>
      <div class="matricula">201751993</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import InputFile from '@/components/InputFile.vue';
import Button from '@/components/Button.vue';
import { deleteStopWords, PorterStemmer} from './logic';

export default defineComponent({
  name: 'App',
  components: {
    InputFile,
    Button,
  },
  setup() {
    const text = ref('');
    const activeButtons = reactive({
      lexico: false,
      cerradas: false,
      truncamiento: false,
    });

    function loadText(event: any){
      text.value = event;
      activeButtons.lexico = false;
      activeButtons.cerradas = false;
      activeButtons.truncamiento = false;
    }

    function analisisLexico(){
      if(text.value.length <= 0){
        alert('Seleccione un documento antes de tratar de hacer el analisis lexico');
        return;
      }
      const re = new RegExp('[\.\,\:\;\?\!\'\"\”\“\’\…]', 'g'); // eslint-disable-line
      text.value = text.value.replaceAll(re, ''); // eslint-disable-line
      activeButtons.lexico = true;
    }

    function eliminacion(){
      if(text.value.length <= 0){
        alert('Seleccione un documento antes de tratar de hacer el analisis lexico');
        return;
      }
      if(activeButtons.lexico === false){
        alert('Ejecute primero el analisis lexico antes de la eliminacion de palabras');
        return;
      }
      text.value = deleteStopWords(text.value);
      activeButtons.cerradas = true;
    }

    function truncamiento(){
      if(text.value.length <= 0){
        alert('Seleccione un documento antes de tratar de hacer el analisis lexico');
        return;
      }
      if(activeButtons.lexico === false || activeButtons.cerradas === false){
        alert('Ejecute primero el analisis lexico y la eliminacion de palabras antes del truncamiento');
        return;
      }
      const porter = new PorterStemmer();
      text.value = porter.steem(text.value);
      activeButtons.truncamiento = true;
    }

    return {
      text,
      loadText,
      activeButtons,
      analisisLexico,
      eliminacion,
      truncamiento,
    };
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
*{
  padding: 0;
  margin: 0;
}

html {
  
  font-family: 'Poppins', sans-serif;
  background: #ecf0f3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100vh;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h3 {
  margin-right: auto;
}

textarea{
  padding: 8px 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  width: 80%;
  height: 55vh;
  border: none;
  resize: none;
  background: inherit;
  border-radius: 8px;
  box-shadow: inset 6px 6px 6px rgba(0, 0, 0, 0.3),
            inset -6px -6px 6px rgba(255, 255, 255, 0.8);
}
textarea:focus{
  outline: none;
}

.team {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.team .integrante {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.team .integrante > div {
  width: auto;
  font-size: 12px;
  color: rgb(134, 134, 134);
  margin: 4px;
}

div.matricula {
  text-align: left;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100%;
}
</style>
