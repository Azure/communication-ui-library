var fs = require('fs');

const createCi = () => {
    var stringOut = {
        flavor : 'stable'
    }
    fs.writeFile('ci-stable.json', stringOut);
}

const main = () => {
    createCi();
}

main();