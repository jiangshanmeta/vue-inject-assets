import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes:[
        {
            path:"/",
            alias:"/pageA",
            component:()=>import("@/pageA"),
        },
        {
            path:"/pageB",
            component:()=>import("@/pageB"),
        }
    ],
})