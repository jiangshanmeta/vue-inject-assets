# vue-inject-assets

向子组件注入component/filter/directive


vue中局部注册的组件在子组件中不可用，为了解决这个问题写了这个插件，并且推广到了资源(组件，过滤器，指令)。然而通常而言只有向子组件注入局部注册的组件有意义。

使用方法：


提供注册的组件：

```javascript
provideComponent:[
    'shareA',
    {
        name:"shareB",
        component:()=>import("./shareA"),
        force:true,
    }
],
provideComponent:{
    'shareA':true,
    'testShare3':'shareA',
    testShare1:()=>import("./shareA"),
    testShare2:{
        component:'shareA',
        force:true,
    },
},
```

通过自定义选项provideComponent提供向子组件注入的组件，有两种基本语法，数组语法和对象语法。

对于数组语法，一项可以是一个字符串，字符串就是向下注入时的名称，同时也是局部注册的组件的名称。数组语法的一项，也可以是一个对象，其中name字段是向下注入时的名称，如果有component属性，那么向下注入的组件就是component属性的值，没有component属性则根据name字段寻找局部注册的组件，还有一个force属性，默认为false，置为true意味着强制注入到子组件中。

对于对象语法，键是向下注入时的名称，值有多重类型。如果值是布尔值，则向下注入的组件是同名局部注册的组件，布尔值决定是否强行注入。如果值是字符串类型，根据该值查找局部注册的组件。如果值是一个函数，则该函数作为向下注入的组件(一个场景是自己本身不需要这个组件，有多个子组件需要这个组件)。如果值是对象类型，类似于数组语法中的一项是对象的情况，先尝试取component属性，然后尝试取局部注册的组件，force属性决定子组件是否强制注册。


接受注入的组件：


```javascript
injectComponent:[
    'shareA'
],
injectComponent:{
    shareC:'shareA',
},
``` 

接受注入也是有两种语法形式，数组语法和对象语法。输入语法意味着本地注册名和祖先组件提供的名称相同。对象语法则更灵活，键是本地注册名称，值是祖先组件提供的名称。