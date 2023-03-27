// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { _CaptionsBanner } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { Stack } from '@fluentui/react';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

/** @private */
export const CaptionsBanner = (): JSX.Element => {
  const captionsBannerProps = usePropsFor(_CaptionsBanner);

  return (
    <>
      {captionsBannerProps.captions.length > 0 && (
        <Stack horizontalAlign="center">
          <Stack.Item style={{ width: '50%' }}>
            <_CaptionsBanner {...captionsBannerProps} />
          </Stack.Item>
        </Stack>
      )}
    </>
  );
};
