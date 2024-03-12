module.exports = {
    webpack: function (config, env) {
        config.resolve.fallback = {
            fs: false,
            path: false,
            crypto: false,
        };

        return config;
    },
};