import {
    ucfirst,
} from "./helper"

import {
    provideOptionPrefix,
    provideVMKey,
    forceProvideVMKey,
} from "./const"

const assets = ['component','filter','directive'];

function normalizeProvideOption(options,key){
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
                }
            })
        }else{
            target[name] = value;
        }
    });
}

export default {
    install(Vue){
        Vue.mixin({
            beforeCreate(){
                // 处理inject
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

                    const nomalizedProvideOption = normalizeProvideOption(provideAssetOption,asset);
                    const assetObj = this.$options[asset + 's'];

                    resolveProvideAsset(this[provideVMKey + key],nomalizedProvideOption,assetObj,asset);
                    resolveForceProvideAsset(this[forceProvideVMKey + key],nomalizedProvideOption,assetObj,asset);


                });

            },
        })
    }
}