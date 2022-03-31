var fs = require('fs');

const parseCIFlavors = () => {
    fs.readFile('../config/gh-actions/ci-config.json', (err, data) => {
        if(err){
            return 'failed to open CI Flavor config file';
        }
        let configJson = JSON.parse(data);
        let stringifiedConfig = JSON.stringify(configJson);
        stringifiedConfig = stringifiedConfig.replace(/"/g, '\\"');
        console.log(stringifiedConfig);
        fs.writeFile('../config/gh-actions/ci-config.txt', stringifiedConfig);
        return stringifiedConfig;

    });
}

const main = () => {
   return parseCIFlavors();
}

main();
