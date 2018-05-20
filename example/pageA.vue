<template>
    <section>
        this is pageA

        <router-link to="/pageB">去往 B页面</router-link>
        <br>

        <child-a1></child-a1>

        <child-a2></child-a2>

        <share-a></share-a>
    </section>
</template>

<script>
import childA1 from "./childA1"
import childA2 from "./childA2"
import shareA from "./shareA"

export default{
    components:{
        childA1,
        childA2,
        shareA
    },
    // provideComponent:{
        // shareA:true,
    //     testShare1:()=>import("./shareA"),
    //     testShare2:{
    //         component:'shareA',
    //         force:true,
    //     },
    //     testShare3:"shareA"
    // },
    provideComponent:[
        'shareA',
        {
            component:()=>import("./shareA"),
            name:"shareB",
            force:true,
        }
    ],
    created(){
        console.log(this)
    }
}
</script>