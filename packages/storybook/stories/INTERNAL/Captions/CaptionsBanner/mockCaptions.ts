// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CaptionInfo } from '@internal/react-components';

export const GenerateMockNewCaption = (): CaptionInfo => {
  return {
    displayName: 'SpongeBob',
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };
};

export const GenerateMockNewShortCaption = (): CaptionInfo => {
  return {
    displayName: 'SpongeBob Patrick',
    caption: 'Lorem ipsum dolor sit amet'
  };
};

export const GenerateMockNewCaptionWithLongName = (): CaptionInfo => {
  return {
    displayName: 'SpongeBob Patrick Robert',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
  };
};

export const GenerateMockNewCaptions = (): CaptionInfo[] => {
  return [
    {
      displayName: 'Caroline',
      caption: 'Hello there'
    },
    {
      displayName: 'Mike',
      caption: 'Hi welcome'
    },
    {
      displayName: 'SpongeBob Patrick Robert',
      caption:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      displayName: 'Patrick',
      caption:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      displayName: 'Sandy',
      caption: 'Lorem ipsum dolor sit amet'
    }
  ];
};
