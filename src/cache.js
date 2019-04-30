import { Logger } from '@beautywe/core';
import SuperCache from '@jerryc/super-cache';

const logger = new Logger({ prefix: 'plugin-cache' });

/**
 * Get cache plugin
 * @param {Array} options.adapters - adapters 数组
 * @param {object} [options.stroage] - 自定义存储数据，默认存到内存，对应 `new SuperCache({ storage })`
 * @param {object} [options.adapterOptions] - adapter 的全局配置，对应 `new SuperCache({ adapterOptions })`
 * @param {object} [options.extra] - cache 的额外配置，对应 `new SuperCache({ extra })`
 */
module.exports = function plugin({ adapters = [], storage, extra, adapterOptions } = {}) {

    const cache = new SuperCache(Object.assign({
        log: {
            info: (title, message, data) => logger.info(`${title}:${message}`, data),
            debug: (title, message, data) => logger.debug(`${title}:${message}`, data),
            warn: (title, message, data) => logger.warn(`${title}:${message}`, data),
            error: (title, message, error) => logger.error(`${title}:${message}`, error),
        },
    }, { storage, extra, adapterOptions }));

    return {
        name: 'cache',

        nativeHook: {
            onLoad() {
                return this.cache.initAdapters();
            },
            onLaunch() {
                return this.cache.initAdapters();
            },
        },

        customMethod: {
            get(key) {
                return cache.get(key);
            },
            set(key, value) {
                return cache.set(key, value);
            },
            remove(key) {
                return cache.remove(key);
            },
            getCacheInstance() {
                return cache;
            },
            initAdapters() {
                adapters.forEach(adapter => adapter && cache.addAdapter(adapter.key, adapter));
            },
        },
    };
};