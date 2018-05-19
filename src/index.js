import {
    ucfirst,
} from "./helper"

import {
    provideOptionPrefix,
    provideVMKey,
    forceProvideVMKey,
    injectOptionPrefix,
} from "./const"

const assets = ['component','filter','directive'];

function normalizeProvideAsset(options,key){
    // 可能是数组，也可能是对象
    let target = Object.create(null);

    if(Array.isArray(options)){

        for(let item of options){
            let type = typeof item;
            if(type === 'string'){
                target[item] = {
                    [key]:item,
                    force:false,
                };
            }else if(type === 'object' && item.hasOwnProperty('name')){
                target[item.name] = {
                    [key]:item[key]?item[key]:item.name,
                    force:Boolean(item.force),
                }
            }
        }
    }else{
        Object.keys(options).forEach((name)=>{
            let descriptor = options[name];
            let asset;
            let force;
            let type = typeof descriptor;
            if(type === 'boolean'){
                asset = name;
                force = descriptor;
            }else if(type === 'string'){
                asset = descriptor;
                force = false;
            }else if(type === 'function'){
                asset = descriptor;
                force = false;
            }else if(type === 'object'){
                asset = descriptor[key]?descriptor[key]:name;
                force = descriptor.force;
            }

            target[name] = {
                [key]:asset,
                force,
            }
        });
    }
    return target;
}

function resolveProvideAsset(target,provide,assets,key){
    Object.keys(provide).forEach((name)=>{
        let value = provide[name][key];
        let type = typeof value;
        if(type === 'string'){
            Object.defineProperty(target,name,{
                get(){
                    return assets[value]
                },
                enumerable:true,
            })
        }else{
            target[name] = value;
        }

        
    });
}

function resolveForceProvideAsset(target,provide,assets,key){
    Object.keys(provide).forEach((name)=>{
        let value = provide[name][key];
        if(!provide[name].force){
            return;
        }
        let type = typeof value;
        if(type === 'string'){
            Object.defineProperty(target,name,{
                get(){
                    return assets[value]
                },
                enumerable:true,
            })
        }else{
            target[name] = value;
        }
    });
}

function normalizeInjectAsset(options){
    // 最终处理成对象形式，键是最终注册名，值是组件组件提供的资源名称
    if(Array.isArray(options)){
        let target = Object.create(null);
        for(let item of options){
            target[item] = item
        }
        return target
    }

    return options;
}

export default {
    install(Vue){
        Vue.mixin({
            beforeCreate(){
                // 处理inject
                assets.forEach((asset)=>{
                    const key = ucfirst(asset);
                    const forceAsset = Object.create(null);
                    let vm = this.$parent;

                    // 强制注册的资源
                    while(vm){
                        Object.keys(vm[forceProvideVMKey + key]).forEach((name)=>{
                            this.$options[asset + 's'][name] = vm[forceProvideVMKey + key][name];
                            forceAsset[name] = true;
                        })

                        vm = vm.$parent;
                    }

                    // 自身申明注册的资源
                    const injectAssetOption = this.$options[injectOptionPrefix + key];
                    if(!injectAssetOption){
                        return;
                    }
                    const normalizedInjectOption = normalizeInjectAsset(injectAssetOption);

                    Object.keys(normalizedInjectOption).forEach((localAssetName)=>{
                        const parentAssetName = normalizedInjectOption[localAssetName];
                        // 如果是强制注册的不再注册
                        if(forceAsset[parentAssetName]){
                            return;
                        }
                        let vm = this.$parent;
                        while(vm){
                            if(vm[provideVMKey + key][parentAssetName]){
                                this.$options[asset + 's'][localAssetName] = vm[provideVMKey + key][parentAssetName];
                                return;
                            }
                            vm = vm.$parent;
                        }

                    });


                });

            },
            created(){
                // 处理 provide
                assets.forEach((asset)=>{
                    const key = ucfirst(asset);
                    this[provideVMKey + key] = Object.create(null);
                    this[forceProvideVMKey + key] = Object.create(null);

                    const provideAssetOption = this.$options[provideOptionPrefix + key];
                    if(!provideAssetOption){
                        return;
                    }

                    const normalizedProvideOption = normalizeProvideAsset(provideAssetOption,asset);
                    const assetObj = this.$options[asset + 's'];

                    resolveProvideAsset(this[provideVMKey + key],normalizedProvideOption,assetObj,asset);
                    resolveForceProvideAsset(this[forceProvideVMKey + key],normalizedProvideOption,assetObj,asset);


                });

            },
        })
    }
}