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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    appSettings = require(appSettingsPath);
  }
}

/**
 * Retrieves the ACS connection string from environment variables or appsettings.json
 *
 * @returns The ACS connection string from environment variables or appsettings.json
 * @throws Error if no ACS connection string is provided
 */
export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

/**
 * Retrieves the ACS endpoint URL from environment variables or appsettings.json
 *
 * @returns The ACS endpoint URL from environment variables or appsettings.json
 */
export const getEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

/**
 * Retrieves the ACS Admin UserId from environment variables or appsettings.json
 *
 * @returns The ACS Admin UserId from environment variables or appsettings.json
 * @throws Error if no ACS Admin UserId is provided
 */
export const getAdminUserId = (): string => {
  const adminUserId = process.env['AdminUserId'] || appSettings.AdminUserId;

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};

/**
 * Retrieves the Azure Blob Storage endpoint from environment variables or appsettings.json
 *
 * @returns The Azure Blob Storage endpoint URL
 */
export const getAzureBlobStorageEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl'] || appSettings.EndpointUrl);
  return `${uri.protocol}//${uri.host}`;
};

/**
 * Retrieves the Azure Blob Storage connection string from environment variables or appsettings.json
 *
 * @returns The Azure Blob Storage connection string
 * @throws Error if no Azure Blob Storage connection string is provided
 */
export const getAzureBlobStorageConnectionString = (): string => {
  const accountName = process.env['AzureBlobStorageConnectionString'] || appSettings.AzureBlobStorageConnectionString;

  if (!accountName) {
    throw new Error('No Azure Blob Storage Connection String provided');
  }

  return accountName;
};
