// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as fs from 'fs';
import * as path from 'path';
const appSettingsPath = path.join(__dirname, '../../appsettings.json');
let appSettings: {
  ResourceConnectionString: string;
  EndpointUrl: string;
  AdminUserId: string;
  AzureBlobStorageConnectionString: string;
};
if (
  !(
    process.env['ResourceConnectionString'] ||
    process.env['EndpointUrl'] ||
    process.env['AdminUserId'] ||
    process.env['AzureBlobStorageConnectionString']
  )
) {
  if (!fs.existsSync(appSettingsPath)) {
    throw new Error(
      'No appsettings.json found. Please provide an appsettings.json file by copying appsettings.json.sample and removing the .sample extension'
    );
  } else {
    appSettings = require(appSettingsPath);
  }
}

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

export const getAdminUserId = (): string => {
  const adminUserId = process.env['AdminUserId'] || appSettings.AdminUserId;

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};

export const getAzureBlobStorageEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

export const getAzureBlobStorageConnectionString = (): string => {
  const accountName = process.env['AzureBlobStorageConnectionString'] || appSettings.AzureBlobStorageConnectionString;

  if (!accountName) {
    throw new Error('No Azure Blob Storage Connection String provided');
  }

  return accountName;
};
