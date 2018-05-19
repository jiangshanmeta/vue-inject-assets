<template>
    <section style="border:1px solid #666;margin-top:20px;margin-bottom:20px;">
        <div style="color:blue;">child component for pageA number 2</div>
        <grand-child-a2></grand-child-a2>
        <!-- <share-a></share-a> -->
    </section>
</template>

<script>
import grandChildA2 from "./grandChildA2"

export default{
    components:{
        grandChildA2
    },
}
</script>