// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useState } from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsBanner, _CaptionsBannerStrings } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(close-captions) */
import { CaptionsSettingsModal } from './CaptionsSettingsModal';
/* @conditional-compile-remove(close-captions) */
import { CaptionsBannerMoreButton } from './CaptionsBannerMoreButton';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { _captionsBannerSelector } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';

/** @private */
export const CaptionsBanner = (props: { isMobile: boolean }): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const captionsBannerProps = useAdaptedSelector(_captionsBannerSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsBanner);
  /* @conditional-compile-remove(close-captions) */
  const [isCaptionsSettingsOpen, setIsCaptionsSettingsOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(close-captions) */
  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(true);
  };
  /* @conditional-compile-remove(close-captions) */
  const onDismissCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(false);
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

  /* @conditional-compile-remove(close-captions) */
  const strings = useLocale().strings.call;

  /* @conditional-compile-remove(close-captions) */
  const captionsBannerStrings: _CaptionsBannerStrings = {
    captionsBannerSpinnerText: strings.captionsBannerSpinnerText
  };
  return (
    <>
      {
        /* @conditional-compile-remove(close-captions) */ isCaptionsSettingsOpen && (
          <CaptionsSettingsModal
            showCaptionsSettingsModal={isCaptionsSettingsOpen}
            onDismissCaptionsSettings={onDismissCaptionsSettings}
          />
        )
      }
      {
        /* @conditional-compile-remove(close-captions) */ captionsBannerProps.isCaptionsOn && (
          <div className={containerClassName}>
            <Stack horizontalAlign="center">
              <Stack.Item style={{ width: props.isMobile ? '90%' : '50%' }}>
                <_CaptionsBanner
                  {...captionsBannerProps}
                  {...handlers}
                  formFactor={props.isMobile ? 'compact' : 'default'}
                  strings={captionsBannerStrings}
                />
              </Stack.Item>
            </Stack>
            {!props.isMobile && captionsBannerProps.isCaptionsOn && (
              <div className={floatingChildClassName}>
                <CaptionsBannerMoreButton onCaptionsSettingsClick={onClickCaptionsSettings} />
              </div>
            )}
          </div>
        )
      }
    </>
  );
};
