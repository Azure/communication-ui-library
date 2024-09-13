// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad as DialpadComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import React from 'react';

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const DialpadStory = (args): JSX.Element => {
  const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile() || isIOS();
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      <DialpadComponent
        longPressTrigger={isMobile ? 'touch' : 'mouseAndTouch'}
        disableDtmfPlayback={args.disableDtmfPlayback}
        dialpadMode={args.dialpadMode}
      />
    </div>
  );
};

export const Dialpad = DialpadStory.bind({});
