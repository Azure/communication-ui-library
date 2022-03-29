var fs = require('fs');

const disableBetaCi = () => {
    var result = fs.readFile('./ci-stable.json', 'utf-8', (err, data) => {
        if (err) {
            return true;
        } else {
            const ci = JSON.parse(data);
            if (ci.flavor === 'stable') {
                return false;
            } else {
                return true;
            }
        }
    });
    return result;
}

const main = () => {
    return disableBetaCi();
}