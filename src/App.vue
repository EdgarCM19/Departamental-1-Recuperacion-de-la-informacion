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
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import InputFile from '@/components/InputFile.vue';
import Button from '@/components/Button.vue';

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
      console.log('holas');
      activeButtons.lexico = false;
      activeButtons.cerradas = false;
      activeButtons.truncamiento = false;
    }

    function analisisLexico(){
      const re = new RegExp('[\.\,\:\;\?\!\'\"\”\“\’]', 'g'); // eslint-disable-line
      text.value = text.value.replaceAll(re, ''); // eslint-disable-line
      activeButtons.lexico = true;
    }

    function eliminacion(){
      console.log('Eliminacion');
      activeButtons.cerradas = true;
    }

    function truncamiento(){
      console.log('truncamiento');
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
  width: 100%;
  height: 60vh;
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

#app {
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
