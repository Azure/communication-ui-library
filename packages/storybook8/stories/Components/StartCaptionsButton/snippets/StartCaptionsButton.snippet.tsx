// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartCaptionsButton, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const StartCaptionsButtonStory = (): JSX.Element => {
  const startCaptionsButtonProps = usePropsFor(StartCaptionsButton);

  return (
    <>
      {startCaptionsButtonProps && (
        <StartCaptionsButton
          {...startCaptionsButtonProps}
          onStartCaptions={async () => {
            console.log('Caption is Starting');
            startCaptionsButtonProps.onStartCaptions();
          }}
        />
      )}
    </>
  );
};
