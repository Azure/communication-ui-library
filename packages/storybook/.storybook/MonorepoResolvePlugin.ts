import { ResolvePlugin } from 'webpack';
import communicationUIPackage from '../../communication-ui/package.json';
import getInnerRequest from 'enhanced-resolve/lib/getInnerRequest';

type MappedInfo = {
  name: string;
  mainField: string;
};

/**
 * The main goal of this plugin is to map references to JS files of packages in this monorepo to
 * their original TS source so that loaders can be used for efficient watching of files and faster dev builds.
 */
export class MonorepoResolvePlugin implements ResolvePlugin {
  public source: string;
  public target: string;
  private packagesInfoMap: Map<string, MappedInfo> = new Map();

  constructor() {
    console.log("MonorepoResolvePlugin ctor");
    this.source = 'describedResolve';
    this.target = 'parsedResolve';

    // pre-calculate some of the mapping data to avoid doing it on every import reference
    // for now just do this with communicationUIPackage, ideally this would loop through
    // all monorepo packages.
    const packageData = {
      name: communicationUIPackage.name,
      module: communicationUIPackage.module,
      main: communicationUIPackage.main
    };

    this.packagesInfoMap.set(packageData.name, {
      name: packageData.name,
      // convert reference to .js files in dist to the src files:
      mainField: packageData.module ? mapModuleField(packageData.module) : mapMainField(packageData.main)
    });

    console.log(this.packagesInfoMap);
  }

  apply(resolver: any): void {
    console.log("MonorepoResolvePlugin apply");
    const target = resolver.ensureHook(this.target);

    resolver
      .getHook(this.source)
      .tapAsync({ name: 'MonorepoResolvePlugin' }, (request: any, resolverContext: any, callback: any) => {
        const innerRequest: string = getInnerRequest(resolver, request).replace(/^\.\/node_modules\//, '');
        console.log(``);
        // console.log(`request: ${JSON.stringify(request)}`);
        console.log(`innerRequest: ${innerRequest}`);
        const issuer = request.context.issuer || "";
        console.log(`request issuer: ${issuer}`);
        const packageName = getPackageName(issuer);
        console.log(`packageName: ${packageName}`);
        console.log(``);

        // Exit early if this request is not a package we want to map
        // const packageInfo = this.packagesInfoMap.get(packageName);
        // if (!packageInfo) {
        //   return callback();
        // }

        if(!packageName.startsWith("D:\\repos\\communication-ui-sdk\\packages\\communication-ui\\dist")) {
          return callback();
        }

        const packageInfo = this.packagesInfoMap.get("@azure/communication-ui");
        console.log(`packageInfo: ${packageInfo.name}`);

        const newRequestStr = `${packageInfo.name}/${packageInfo.mainField}`;
        if (!newRequestStr) {
          throw new Error('Invalid new request string!');
        }

        console.log(`Processing package: ${packageName}`);
        const obj = Object.assign({}, request, {
          request: newRequestStr,
        });
        return resolver.doResolve(
          target,
          obj,
          `monorepo file mapped to '${newRequestStr}'`,
          resolverContext,
          (err: any, result: any) => {
            if (err) {
              return callback(err);
            }
            // Don't allow other aliasing or raw request
            if (result === undefined) {
              return callback(null, null);
            }
            callback(null, result);
          }
        );
      });
  }
}

/**
 * Get reference to src folder instead of dist folder from main field in package.json
 * @param mainField `main` field in the package.json e.g. /dist/dist-cjs/index.js
 * @returns relative reference to src folder
 */
function mapMainField(mainField: string): string {
  let mappedEntry = mainField.replace('dist/dist-cjs', '/src');
  if (mappedEntry.endsWith('.js')) {
    mappedEntry = mappedEntry.replace('.js', '');
  }
  return mappedEntry;
}

/**
 * Get reference to src folder instead of dist folder from module field in package.json
 * @param moduleField `main` field in the package.json e.g. /dist/dist-esm/index.js
 * @returns relative reference to src folder
 */
function mapModuleField(moduleField: string): string {
  let mappedEntry = moduleField.replace('dist/dist-esm', '/src');
  if (mappedEntry.endsWith('.js')) {
    mappedEntry = mappedEntry.replace('.js', '');
  }
  return mappedEntry;
}

function getPackageName(importPath: string): string {
  const firstSlashIndex = importPath.indexOf('/');
  if (firstSlashIndex <= 0) {
    // eg. my-lib, business-app-fabric
    return importPath;
  }

  // unscoped package
  if (!importPath.startsWith('@')) {
    // business-app-fabric/lib/component => business-app-fabric
    return importPath.substring(0, firstSlashIndex);
  }

  const secondSlashIndex = importPath.indexOf('/', firstSlashIndex + 1);
  if (secondSlashIndex <= firstSlashIndex) {
    // eg. @maker-studio/shell-config
    return importPath;
  }
  // eg. @maker-studio/shell-config/lib/abc
  return importPath.substring(0, secondSlashIndex);
}
