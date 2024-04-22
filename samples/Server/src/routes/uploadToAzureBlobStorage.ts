// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getAzureBlobStorageConnectionString } from '../lib/envHelper';
import { BlobSASPermissions, BlobServiceClient, ContainerSASPermissions, SASProtocol } from '@azure/storage-blob';
// Alternatively, you can use `connect-busboy`, `express-busboy`, or anything else with `express.JS` to handle file uploads.
import multer from 'multer';

const router = express.Router();

const upload = multer();

/**
 * route: /uploadToAzureBlobStorage/log
 *
 * purpose: Upload logs to azure blob storage
 * @param log: string containing log to upload to a blob
 * @param containerName: name of the container to upload to
 * @param blobName: (optional) name of the blob to upload to
 *
 * @returns SAS URL for accessing blob. This URL is valid for 90 days.
 *
 */
router.post('/log', async function (req, res, next) {
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

/**
 * route: /uploadToAzureBlobStorage/file
 *
 * purpose: Upload a file to azure blob storage
 * @param req.body: the form data containing the file
 * @param req.params.filename: the filename of the file
 * @param req.params.containerName: name of the container to upload to
 *
 * @returns SAS URL for accessing blob. This URL is valid for 1 hour.
 *
 */
router.post('/file/:filename/:containername', upload.single('file'), async function (req, res, next) {
  const SAS_EXPIRY = 1 * 60 * 60; // 1 hour

  const fileData = req.file;

  if (!fileData) {
    res.status(400).send('file not found in request');
    return;
  }
  if (!req.params.filename) {
    res.status(400).send('filename not found in request');
    return;
  }
  if (!req.params.containername) {
    res.status(400).send('containerName not found in request');
    return;
  }

  const fileName = req.params.filename;
  const containerName = req.params.containername;

  const fileContentBuffer = fileData.buffer;
  const size = fileData.size;

  // create blob service client
  let connectionString: string;
  try {
    connectionString = getAzureBlobStorageConnectionString();
  } catch (error) {
    res.status(500).send('AzureBlobStorageConnectionString not found');
    console.error(error);
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const blobContainerClient = blobServiceClient.getContainerClient(containerName);
    const client = blobContainerClient.getBlockBlobClient(fileName);

    const response = await client.upload(fileContentBuffer, size);
    const expiresOn = new Date();
    expiresOn.setSeconds(expiresOn.getSeconds() + SAS_EXPIRY);
    const url = await client.generateSasUrl({
      expiresOn: expiresOn,
      permissions: BlobSASPermissions.parse('r'), // Read only permission to the blob
      protocol: SASProtocol.Https // Only allow HTTPS access to the blob
    });
    res.status(200).send({ url });
  } catch (error) {
    console.error(`Error uploading file to Azure Blob Storage: ${error}`);
    res.status(500).send('Error uploading file to Azure Blob Storage');
    return;
  }
});

export default router;
