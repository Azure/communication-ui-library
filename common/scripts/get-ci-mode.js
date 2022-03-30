var fs = require('fs');

const parseCIFlavors = () => {
    fs.readFile('../config/gh-actions/ci-config.json', (err, data) => {
        if(err){
            return 'failed to open CI Flavor config file';
        }
        let configJson = JSON.parse(data);
        let stringifiedConfig = JSON.stringify(configJson);
        return stringifiedConfig;
    });
}

const main = () => {
   return parseCIFlavors();
}

main();
