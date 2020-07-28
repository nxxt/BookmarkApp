<template>
  <v-menu
    :close-on-content-click="false"
    transition="scale-transition"
    lazy
    offset-y
  >
    <template>
      <v-btn icon @click="onClick" v-on="on">
        <v-icon>{{ iconSrc }}</v-icon>
      </v-btn>
    </template>

    <slot></slot>
  </v-menu>
</template>

<script>
export default {
  props: {
    iconSrc: { type: String, default: 'mdi-text' },
    onClick: { type: Function, default: () => {} }
  }
}
</script>
