// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsInformation } from '@azure/communication-react';

export const GenerateMockNewCaption = (): CaptionsInformation => {
  return {
    id: Date.now().toString(),
    createdTimeStamp: new Date(),
    displayName: 'SpongeBob',
    captionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };
};

export const GenerateMockNewShortCaption = (): CaptionsInformation => {
  return {
    id: Date.now().toString(),
    createdTimeStamp: new Date(),
    displayName: 'SpongeBob Patrick',
    captionText: 'Lorem ipsum dolor sit amet'
  };
};

export const GenerateMockNewCaptionWithLongName = (): CaptionsInformation => {
  return {
    id: Date.now().toString(),
    createdTimeStamp: new Date(),
    displayName: 'SpongeBob Patrick Robert',
    captionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
  };
};

export const GenerateMockNewCaptions = (): CaptionsInformation[] => {
  return [
    {
      id: Date.now().toString(),
      createdTimeStamp: new Date(),
      displayName: 'Caroline',
      captionText: 'Hello there'
    },
    {
      id: Date.now().toString() + 1,
      createdTimeStamp: new Date(),
      displayName: 'Mike',
      captionText: 'Hi welcome'
    },
    {
      id: Date.now().toString() + 2,
      createdTimeStamp: new Date(),
      displayName: 'SpongeBob Patrick Robert',
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: Date.now().toString() + 3,
      displayName: 'Patrick',
      createdTimeStamp: new Date(),
      captionText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: Date.now().toString() + 4,
      createdTimeStamp: new Date(),
      displayName: 'Sandy',
      captionText: 'Lorem ipsum dolor sit amet'
    }
  ];
};
