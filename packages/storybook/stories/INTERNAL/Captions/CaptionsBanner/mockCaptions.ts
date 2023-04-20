// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _CaptionsInfo } from '@internal/react-components';

export const GenerateMockNewCaption = (): _CaptionsInfo => {
  return {
    timestamp: new Date(),
    displayName: 'SpongeBob',
    captionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };
};

export const GenerateMockNewShortCaption = (): _CaptionsInfo => {
  return {
    timestamp: new Date(),
    displayName: 'SpongeBob Patrick',
    captionText: 'Lorem ipsum dolor sit amet'
  };
};

export const GenerateMockNewCaptionWithLongName = (): _CaptionsInfo => {
  return {
    timestamp: new Date(),
    displayName: 'SpongeBob Patrick Robert',
    captionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
  };
};

export const GenerateMockNewCaptions = (): _CaptionsInfo[] => {
  return [
    {
      timestamp: new Date(Date.now()),
      displayName: 'Caroline',
      captionText: 'Hello there'
    },
    {
      timestamp: new Date(Date.now() + 1),
      displayName: 'Mike',
      captionText: 'Hi welcome'
    },
    {
      timestamp: new Date(Date.now() + 2),
      displayName: 'SpongeBob Patrick Robert',
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      timestamp: new Date(Date.now() + 3),
      displayName: 'Patrick',
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      timestamp: new Date(Date.now() + 4),
      displayName: 'Sandy',
      captionText: 'Lorem ipsum dolor sit amet'
    }
  ];
};
