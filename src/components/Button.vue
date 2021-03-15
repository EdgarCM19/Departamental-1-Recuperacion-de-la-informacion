<template>
  <button class="btn"
          @click="on_click_fn">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    on_click_fn: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit }) {
    function callback() {
      // eslint-disable-next-line no-console
      console.log('PTOOO');
      emit('click');
    }

    return {
      callback,
    };
  },
});

</script>

<style scoped>
.btn {
  outline: none;
  padding: 8px 16px;
  margin: 8px;
  border: none;
  border-radius: 8px;
  color: #292d32;
  background-color: #ecf0f3;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.3),
            -4px -4px 6px rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  transition: all .3s ease-in-out;
}

.btn:hover {
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5),
            -2px -2px 3px rgba(255, 255, 255, 0.8);
  font-size: 16px
}

.btn:active,
{
  outline: none;
}

.btn:disabled,
.btn[disabled] {
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5),
            inset -1px -1px 2px rgba(255, 255, 255, 0.8);
  font-size: 16px
}
</style>
