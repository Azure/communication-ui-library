// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { NotificationBar as NotificationBarComponent } from '../../../../react-components/src/components';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const NotificationBarStory = (): JSX.Element => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  const strings = {
    title: 'Poor Network Quality',
    closeButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    buttonLabel: 'Join by Phone'
  };

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <NotificationBarComponent
        notificationBarStrings={strings}
        notificationBarIconName="ErrorBarCallNetworkQualityLow"
        onClick={() => alert('joining with phone')}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const NotificationBar = NotificationBarStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-NotificationBar`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/NotificationBar/NotificationBar`,
  component: NotificationBar,
  argTypes: {
    captions: hiddenControl,
    onRenderAvatar: hiddenControl,
    isCaptionsOn: hiddenControl
  }
} as Meta;
