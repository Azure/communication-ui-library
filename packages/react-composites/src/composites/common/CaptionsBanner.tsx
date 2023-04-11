// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsBanner } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
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
  const captionsBannerProps = useAdaptedSelector(_captionsBannerSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsBanner);

  return (
    <>
      {
        /* @conditional-compile-remove(close-captions) */ captionsBannerProps.captions.length > 0 &&
          captionsBannerProps.isCaptionsOn && (
            <Stack horizontalAlign="center">
              <Stack.Item style={{ width: '50%' }}>
                <_CaptionsBanner {...captionsBannerProps} {...handlers} />
              </Stack.Item>
            </Stack>
          )
      }
    </>
  );
};
