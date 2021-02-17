// eslint-disable-next-line @typescript-eslint/no-var-requires
const appSettings = require('../../appsettings.json');

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEnvUrl = (): string => {
  const uri = new URL(getResourceConnectionString().replace('endpoint=', ''));
  return `${uri.protocol}//${uri.host}`;
};
