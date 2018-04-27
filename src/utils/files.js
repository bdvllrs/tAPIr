const fs = require('fs');

/**
 * List all files in a directory
 * @param {string} dir: path of the directory
 * @returns {Object[]} files: list of all files in this directory
 * @returns {string} files[].path: path of the file
 * @returns {string} files[].filename: name of the file
 */
function walkDirectory(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(function (file) {
        if (fs.lstatSync(dir + '/' + file).isDirectory()) {
            files.push(...walkDirectory(dir + '/' + file));
        } else {
            files.push({ path: dir + '/' + file, filename: file });
        }
    });
    return files;
}

exports.walkDirectory = walkDirectory;

