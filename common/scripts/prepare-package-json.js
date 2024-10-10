const path = require('path');
const fs =  require('fs');

const main = () => {
    // making an assumption the working directory is packages/communication-react
    const packagePath = path.resolve(process.cwd(), 'package.json');

    // open up the package.json as JSON
    const packageJson = JSON.parse(fs.readFileSync(packagePath));

    // remove extraneous properties we don't need in the final NPM package
    const result = { ...packageJson };

    delete result.devDependencies;
    delete result.beachball;
    delete result.overrides;

    // write back to the package.json
    fs.writeFileSync(packagePath, JSON.stringify(result, null, 2));
}
  
main();
  