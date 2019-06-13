let resources = '/resources/'
let dirs = [
    resources + 'images',
    resources + 'files',
    resources + 'photos',
]
const fs = require('fs');

module.exports = {
    init: function init(path, extra) {
        !fs.existsSync(path + '/resources') && fs.mkdirSync(path + '/resources');
        if (!path) return
        createDirs(path, dirs);
        if (extra)
            createDirs(path, extra);
    }
}

function createDirs(path, dirs) {
    dirs.forEach(dir => {
        !fs.existsSync(path + dir) && fs.mkdirSync(path + dir);
    });
}