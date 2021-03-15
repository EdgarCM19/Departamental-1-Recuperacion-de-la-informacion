<template>
    <div class="input-file-wrapper">
        <div>Documento selecionado: {{file_path}}</div>
        <input class="input-file" type="file" id="my-file" @change="loadFromFile">
        <label for="my-file" class="input-file-trigger">{{placeholder}}</label>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
    props:{
        placeholder: {
            type: String,
            required: true,
            default: 'Select file',
        },
    },
    setup(_props: any, { emit }: any) {
        const file_path = ref('');
        function loadFromFile(event: any){
            const file = event.target.files[0];
            file_path.value = event.target.files[0].name;
            console.log(file_path.value)
            const reader = new FileReader();
            reader.onload = e => emit('load', e.target?.result);
            reader.readAsText(file);
        }
        return {
            loadFromFile,
            file_path,
        };
    }
}
</script>

<style>
.input-file-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;

}

.input-file-trigger {
    display: block;
    padding: 8px 16px;
    margin: 16px;
    background: #ecf0f3;
    border-radius: 8px;
    box-shadow: 6px 6px 10px rgba(0, 0, 0, .3),
                -6px -6px 10px rgba(255, 255, 255, 0.8);
    font-size: 1em;
    cursor: pointer;
    transition: all .3s ease-in-out;
}

.input-file-trigger:hover {
    /* transform: scale(1.1); */
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .5),
                -2px -2px 4px rgba(255, 255, 255, 0.8);
}

.input-file {
    position: absolute;
    top: 0; left: 0;
    width: 225px;
    opacity: 0;
    padding: 14px 0;
    cursor: pointer;
}
</style>