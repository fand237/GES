const webpack = require('webpack');


module.exports = function override(config) {
 
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    return config;
}

module.exports = function override(config, env) {
    config.module.rules[1].oneOf.forEach((rule) => {
        if (rule.options && rule.options.presets) {
            rule.options.plugins = [
                ...(rule.options.plugins || []),
                [
                    'react-i18next',
                    {
                        locales: ['fr', 'en'],
                        keyAsDefaultValue: true,
                    },
                ],
            ];
        }
    });
    return config;
};
