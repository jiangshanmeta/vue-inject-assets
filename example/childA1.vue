<template>
    <section style="border:1px solid #666;margin-top:20px;margin-bottom:20px;">
        <share-c></share-c>
        <div style="color:blue;">child component for pageA number 1</div>
    </section>
</template>

<script>
export default{
    injectComponent:{
        shareC:'shareA',
    },
    created(){
        console.log(this)
    }
}
</script>