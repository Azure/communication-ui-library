var fs = require('fs');

const parseCIFlavors = () => {
    fs.readFile('../config/gh-actions/ci-config.json', (err, data) => {
        if(err){
            return 'failed to open CI Flavor config file';
        }
        let configJson = JSON.parse(data);
        console.log(configJson);
    });
}

const main = () => {
   parseCIFlavors();
}

main();
