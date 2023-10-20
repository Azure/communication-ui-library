const path = require('path');
const fs =  require('fs');

const main = () => {
    // making an assumption the working directory is packages/communication-react
    const packagePath = path.resolve(process.cwd(), 'package.json');
    console.log('location of package.json to clean up : ' +packagePath);
    
    // open up the package.json as JSON
    const packageJson = JSON.parse(fs.readFileSync(packagePath));

    // remove extraneous properties we don't need in the final NPM package
    const result = { ...packageJson };
    console.log('does package.json contain devDependencies before cleanup :'+ !!result.devDependencies)
    console.log('does package.json contain scripts after cleanup :'+ !!result.scripts)
    console.log('does package.json contain beachball before cleanup :'+ !!result.beachball)

    delete result.devDependencies;
    delete result.scripts;
    delete result.beachball;
    
    console.log('does package.json contain devDependencies after cleanup :'+ !!result.devDependencies)
    console.log('does package.json contain scripts before cleanup :'+ !!result.scripts)
    console.log('does package.json contain beachball after cleanup :'+ !!result.beachball)
  
    // write back to the package.json
    fs.writeFileSync(packagePath, JSON.stringify(result, null, 2));
}
  
main();
  