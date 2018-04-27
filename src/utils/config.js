const {walkDirectory} = require('./files');

/**
 * Load all configuration from config directory
 * @param {string} configDir: directory of the config files
 * @returns {Object} config
 */
exports.loadConfig = function(configDir) {
    const files = walkDirectory(configDir);
    let config = {};
    files.forEach(file => {
        config[file.filename.split('.')[0]] = require(file.path);
    });
    return config;
};