// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useState } from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsBanner } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { CaptionsSettingModal } from './CaptionsSettingModal';
/* @conditional-compile-remove(close-captions) */
import { CaptionsBannerMoreButton } from './CaptionsBannerMoreButton';
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
  /* @conditional-compile-remove(close-captions) */
  const [isCaptionsSettingOpen, setIsCaptionsSettingOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(close-captions) */
  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingOpen(true);
  };
  /* @conditional-compile-remove(close-captions) */
  const onDismissCaptionsSetting = (): void => {
    setIsCaptionsSettingOpen(false);
  };
  /* @conditional-compile-remove(close-captions) */
  const containerClassName = mergeStyles({
    position: 'relative'
  });
  /* @conditional-compile-remove(close-captions) */
  const floatingChildClassName = mergeStyles({
    position: 'absolute',
    right: 0,
    top: 0
  });

  return (
    <>
      {
        /* @conditional-compile-remove(close-captions) */ isCaptionsSettingOpen && (
          <CaptionsSettingModal
            showCaptionsSettingModal={isCaptionsSettingOpen}
            onDismissCaptionsSetting={onDismissCaptionsSetting}
          />
        )
      }
      {
        /* @conditional-compile-remove(close-captions) */ captionsBannerProps.captions.length > 0 &&
          captionsBannerProps.isCaptionsOn && (
            <div className={containerClassName}>
              <Stack horizontalAlign="center">
                <Stack.Item style={{ width: '50%' }}>
                  <_CaptionsBanner {...captionsBannerProps} {...handlers} />
                </Stack.Item>
              </Stack>
              <div className={floatingChildClassName}>
                <CaptionsBannerMoreButton onCaptionsSettingsClick={onClickCaptionsSettings} />
              </div>
            </div>
          )
      }
    </>
  );
};
