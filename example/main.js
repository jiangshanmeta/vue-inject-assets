import Vue from 'vue'

import App from "./App"

import router from "./router"

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