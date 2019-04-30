# @beautywe/plugin-cache
A beautywe plugin warper of [@jerryc/super-cache](https://github.com/JerryC8080/super-cache)

[![CircleCI](https://circleci.com/gh/beautywe/beautywe-plugin-cache/tree/master.svg?style=svg)](https://circleci.com/gh/beautywe/beautywe-plugin-cache/tree/master)

[![NPM Version](https://img.shields.io/npm/v/@beautywe/plugin-cache.svg)](https://www.npmjs.com/package/@beautywe/plugin-cache) [![NPM Downloads](https://img.shields.io/npm/dm/@beautywe/plugin-cache.svg)](https://www.npmjs.com/package/@beautywe/plugin-cache) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@beautywe/plugin-cache.svg)[![Coverage Status](https://coveralls.io/repos/github/beautywe/beautywe-plugin-cache/badge.svg)](https://coveralls.io/github/beautywe/beautywe-plugin-cache)


# 安装

```
$ npm i @beautywe/plugin-cache
```

# 使用

```javascript
import BeautyWe from '@beautywe/core';
import cache from '@beautywe/plugin-cache';

const app = new BeautyWe.BtApp();
app.use(cache({
    // ...
}));
```

## set/get/remove

```javascript
app.cache.set('name', 'jc');

// 输出：jc
app.cache.get('name').then(value => console.log(value));

app.cache.remove('name');

// 输出：undefined
app.cache.get('name').then(value => console.log(value));
```

## Cache Adapters

可以针对某个 key 增加 adapter 来控制缓存的动作：

```javascript
app.use(cache({
    adapters: [{
        key: 'name',
        data() {
            return API.fetch('xxx/name');
        }
    }]
}));
```

假设 `API.fetch('xxx/name')` 是请求服务器接口，返回数据：`jc_from_server`

那么：

```javascript
app.cache.get('name').then((value) => {
    // value: 'jc_from_server'  
});
```

### Adapter 的逻辑

设置 adapter 之后，`get(key)` 的默认逻辑是：    
1. 返回上一次的 key 缓存（如果缓存存在，则等待 `adapter.data()` 返回）
2. 之后请求 `adapter.data()` ，然后刷新缓存
3. 下一次 `get(key)`，重复第一步。

假设 `API.fetch('xxx/name')` 会返回「第几次请求」的这个信息：`jc_from_server_${request_times}`

那么：

```javascript
/**
 * 第一次请求
 * 请求前，name 缓存值：undefined
 * 请求后，name 缓存值：jc_from_server_1;
 * 返回：jc_from_server_1
 */
app.cache.get('name').then((value) => {
    // value: 'jc_from_server_1'  
});

/**
 * 第二次请求
 * 请求前，name 缓存值：jc_from_server_1
 * 请求后，name 缓存值：jc_from_server_2;
 * 返回：jc_from_server_1
 */
app.cache.get('name').then((value) => {
    // value: 'jc_from_server_1'  
});

/**
 * 第三次请求
 * 请求前，name 缓存值：jc_from_server_2
 * 请求后，name 缓存值：jc_from_server_3;
 * 返回：jc_from_server_2
 */
app.cache.get('name').then((value) => {
    // value: 'jc_from_server_2'  
});
```

# Power by [@jerryc/super-cache](https://github.com/JerryC8080/super-cache)

`beautywe-plugin-cache` 是基于 `@jerryc/super-cache` 构建的，要更好的使用该插件，需要阅读 `super-cache` 的文档：[@jerryc/super-cache](https://github.com/JerryC8080/super-cache)

## Plugin set/get/remove

`app.cache.get/set/remove` 是基于 SuperCache 的示例实现的，源码如下：

```javascript
get(key) {
    return cache.get(key);
},
set(key, value) {
    return cache.set(key, value);
},
remove(key) {
    return cache.remove(key);
},
```

## Options on `use(cache(options))`

除了 `adapters` ，options 的其他值，会传给的 `new SuperCache(options)` 中去：

```javascript
app.use(cache({
    // adapters 配置，对应 `(new SuperCache).addAdapters(adapters[n])`
    adapters: [ ... ],

    // 自定义存储数据，默认存到内存，对应 `new SuperCache({ storage })`
    storage: { ... },

    // adapter 的全局配置，对应 `new SuperCache({ adapterOptions })`
    adapterOptions: { ... },

    // cache 的额外配置，对应 `new SuperCache({ extra })`
    extra: { ... },
}));
```

## Get the instance of SuperCache

当然，你可以获取 SuperCache 的实例，然后调用所有 [@jerryc/super-cache](https://github.com/JerryC8080/super-cache) 的 API：

```javascript
const cache = app.cache.getCacheInstance();

// Do all thing like on SuperCache
cache.addAdapters(...);
cache.get(...);
cache.set(...);
cache.remove(...);
// etc...
```

