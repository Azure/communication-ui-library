// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const appSettings = require('../../appsettings.json');

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEnvUrl = (): string => {
  const uri = process.env['EndpointUrl'] || appSettings.EndpointUrl;

  return `${uri.protocol}//${uri.host}`;
};
