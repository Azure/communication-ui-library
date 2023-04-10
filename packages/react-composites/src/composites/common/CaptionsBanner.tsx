// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { _CaptionsBanner } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { _captionsBannerSelector } from '@internal/calling-component-bindings';

/** @private */
export const CaptionsBanner = (): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const captionBannerProps = useAdaptedSelector(_captionsBannerSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsBanner);

  return (
    <>
      {
        /* @conditional-compile-remove(close-captions) */ captionBannerProps.captions.length > 0 && (
          <Stack horizontalAlign="center">
            <Stack.Item style={{ width: '50%' }}>
              <_CaptionsBanner {...captionBannerProps} {...handlers} />
            </Stack.Item>
          </Stack>
        )
      }
    </>
  );
};
