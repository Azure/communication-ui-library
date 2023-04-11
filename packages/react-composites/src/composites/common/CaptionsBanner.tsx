// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import React, { useState } from 'react';
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

/* @conditional-compile-remove(close-captions) */
/** @private */
export const CaptionsBanner = (): JSX.Element => {
  const captionsBannerProps = useAdaptedSelector(_captionsBannerSelector);
  const handlers = useHandlers(_CaptionsBanner);

  const [isCaptionsSettingOpen, setIsCaptionsSettingOpen] = useState<boolean>(false);
  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingOpen(true);
  };

  const onDismissCaptionsSetting = (): void => {
    setIsCaptionsSettingOpen(false);
  };

  const containerClassName = mergeStyles({
    position: 'relative'
  });

  const floatingChildClassName = mergeStyles({
    position: 'absolute',
    right: 0,
    top: 0
  });

  return (
    <>
      {isCaptionsSettingOpen && (
        <CaptionsSettingModal
          showCaptionsSettingModal={isCaptionsSettingOpen}
          onDismissCaptionsSetting={onDismissCaptionsSetting}
        />
      )}
      {captionsBannerProps.captions.length > 0 && captionsBannerProps.isCaptionsOn && (
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
      )}
    </>
  );
};

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
