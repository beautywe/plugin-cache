import { BtApp } from '@beautywe/core';
import test from 'ava';
import cache from '../src/cache';

function newAppUseingPlugin(options) {
    const app = new BtApp();
    const plugin = cache(options);
    app.use(plugin);
    app.onLaunch();
    return Promise
        .resolve()
        .then(() => ({ app, plugin }));
}

test('use plugin', (t) => {
    return Promise
        .resolve()
        .then(() => newAppUseingPlugin())
        .then(({ app, plugin }) => {
            t.is(app._btPlugin.plugins[0].name, plugin.name);
            t.truthy(app[`${plugin.name}`]);
        });
});

test('set/get/remove/getCacheInstance', (t) => {
    let app, cacheIns;
    return Promise
        .resolve()
        .then(() => newAppUseingPlugin({
            adapters: [{
                key: 'name',
                data() {
                    return Promise.resolve('jc');
                },
            }],
        }))
        .then((result) => {
            app = result.app;
            cacheIns = app.cache.getCacheInstance();
            t.truthy(cacheIns);
        })
        .then(() => {
            return app.cache.get('name').then((value) => t.is(value, 'jc'));
        })
        .then(() => {
            app.cache.set('age', 18);
            return app.cache.get('age').then((value) => t.is(value, 18));
        })
        .then(() => {
            app.cache.remove('age');
            return app.cache.get('age').then((value) => t.is(value, undefined));
        })
        .then(() => {
            cacheIns.addAdapter('age', function (){
                return Promise.resolve(16);
            });

            return Promise
                .resolve()
                .then(() => app.cache.get('age'))
                .then((value) => t.is(value, 16));
        });
});