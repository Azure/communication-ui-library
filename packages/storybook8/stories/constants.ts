// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles } from '@fluentui/react';

export const mediaGalleryTileWidthOptions = {
  range: true,
  min: 200,
  max: 800,
  step: 10
};

export const mediaGalleryTileWidthDefault = 400;

export const mediaGalleryTileHeightOptions = {
  range: true,
  min: 125,
  max: 500,
  step: 5
};

export const mediaGalleryTileHeightDefault = 250;

export const mediaGalleryWidthOptions = {
  range: true,
  min: 500,
  max: 1000,
  step: 10
};

export const mediaGalleryWidthDefault = 600;

export const mediaGalleryHeightOptions = {
  range: true,
  min: 500,
  max: 1000,
  step: 10
};

export const mediaGalleryHeightDefault = 500;

export const compositeExperienceContainerStyle: IStackStyles = {
  root: {
    width: '90vw',
    height: '90vh'
  }
};

export const overviewPageImagesStackStyle = { backgroundColor: '#EFF6FC', padding: '2.25rem' };
export const overviewPageUIArtifactsStackStyle = {
  backgroundColor: '#FAF9F8',
  maxWidth: '20rem',
  display: 'block'
};
export const overviewPageUIArtifactTextStyle = {
  padding: '2rem 2rem 0rem 2rem'
};
export const overviewPageUIArtifactImageStyle = {
  padding: '0rem 1rem 1rem 1rem'
};

export const MICROSOFT_AZURE_PREVIEWS_URL = 'https://azure.microsoft.com/support/legal/preview-supplemental-terms/';

export const MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART =
  'https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/identity/quick-create-identity';
