var fs = require('fs');

const parseCIFlavors = () => {
    fs.readFile('../config/gh-actions/ci-config.json', (err, data) => {
        if(err){
            return 'failed to open CI Flavor config file';
        }
        let configJson = JSON.parse(data);
        return configJson;
    });
}

const main = () => {
   return parseCIFlavors();
}

main();
