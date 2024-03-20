// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getAzureBlobStorageConnectionString } from '../lib/envHelper';
import { BlobServiceClient, ContainerSASPermissions } from '@azure/storage-blob';

const router = express.Router();

/**
 * route: /uploadToAzureBlobStorage/
 *
 * purpose: Upload to azure blob storage
 * @param data: string containing data to upload to a blob
 * @param containerName: name of the container to upload to
 * @param blobName: (optional) name of the blob to upload to
 *
 * @returns SAS URL for accessing blob. This URL is valid for 90 days.
 *
 */

router.post('/', async function (req, res, next) {
  const logs: string = req.body.logs;
  if (!logs) {
    res.status(400).send('logs not found in request');
    return;
  }

  const containerName: string = req.body.containerName;
  if (!containerName) {
    res.status(400).send('containerName not found in request');
    return;
  }

  // create blob service client
  let connectionString: string;
  try {
    connectionString = getAzureBlobStorageConnectionString();
  } catch (error) {
    res.status(500).send('AzureBlobStorageConnectionString not found');
    console.error(error);
    return;
  }
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  // create container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  // create blob
  const blobName = req.body.blobName ?? `${new Date().toISOString()}.txt`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // upload logs to blob
  const response = await blockBlobClient.upload(logs, logs.length);

  if (response.errorCode) {
    res.status(500).send(response.errorCode);
    return;
  }

  // get blob url
  const sasToken = await blockBlobClient.generateSasUrl({
    permissions: ContainerSASPermissions.parse('r'),
    expiresOn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  });

  // return blob url
  res.status(200).send(sasToken);
});

export default router;
