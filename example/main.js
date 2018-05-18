import Vue from 'vue'

import App from "./App"

import router from "./router"

import injectAssets from "src"
Vue.use(injectAssets)

new Vue({
    el:"#app",
    components:{
        App
    },
    router,
    render(h){
        return h('App');
    },
})