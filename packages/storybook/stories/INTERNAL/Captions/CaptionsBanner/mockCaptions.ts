// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _CaptionsInfo } from '@internal/react-components';

export const GenerateMockNewCaption = (): _CaptionsInfo => {
  return {
    displayName: 'SpongeBob',
    captionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };
};

export const GenerateMockNewShortCaption = (): _CaptionsInfo => {
  return {
    displayName: 'SpongeBob Patrick',
    captionText: 'Lorem ipsum dolor sit amet'
  };
};

export const GenerateMockNewCaptionWithLongName = (): _CaptionsInfo => {
  return {
    displayName: 'SpongeBob Patrick Robert',
    captionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
  };
};

export const GenerateMockNewCaptions = (): _CaptionsInfo[] => {
  return [
    {
      displayName: 'Caroline',
      captionText: 'Hello there'
    },
    {
      displayName: 'Mike',
      captionText: 'Hi welcome'
    },
    {
      displayName: 'SpongeBob Patrick Robert',
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      displayName: 'Patrick',
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      displayName: 'Sandy',
      captionText: 'Lorem ipsum dolor sit amet'
    }
  ];
};
