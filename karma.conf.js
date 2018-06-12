module.exports = function(config) {
    config.set({
        basePath: './test',
        frameworks: ['jasmine'],
        files: [
            '*.js'
        ]
    });
};