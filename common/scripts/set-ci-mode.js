var fs = require('fs');

const createCi = (ciMode) => {
    if(ciMode === 'beta'){
        var stringOut = {
            flavor : 'beta'
        }
        fs.writeFile('ci-mode.json', stringOut);
    } else {
        var stringOut = {
            flavor : 'stable'
        }
        fs.writeFile('ci-mode.json', stringOut)
    }
}