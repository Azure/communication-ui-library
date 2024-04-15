// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { useState, useEffect, useCallback } from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsBanner, _CaptionsBannerStrings, CustomAvatarOptions } from '@internal/react-components';
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
/* @conditional-compile-remove(close-captions) */
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';

/* @conditional-compile-remove(close-captions) */
const mobileViewBannerWidth = '90%';

/** @private */
export const CaptionsBanner = (props: {
  isMobile: boolean;
  useTeamsCaptions?: boolean;
  /* @conditional-compile-remove(close-captions) */ onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}): JSX.Element => {
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
  /* @conditional-compile-remove(close-captions) */
  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />;
    },
    [props.onFetchAvatarPersonaData]
  );
  /* @conditional-compile-remove(close-captions) */
  const { innerWidth: width } = window;
  /* @conditional-compile-remove(close-captions) */
  const [windowWidth, setWindowWidth] = useState(width);
  /* @conditional-compile-remove(close-captions) */
  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* @conditional-compile-remove(close-captions) */
  const desktopViewBannerWidth = windowWidth > 620 ? '35rem' : '80%';

  return (
    <>
      {
        /* @conditional-compile-remove(close-captions) */ isCaptionsSettingsOpen && (
          <CaptionsSettingsModal
            showCaptionsSettingsModal={isCaptionsSettingsOpen}
            onDismissCaptionsSettings={onDismissCaptionsSettings}
            changeCaptionLanguage={props.useTeamsCaptions}
          />
        )
      }
      {
        /* @conditional-compile-remove(close-captions) */ <div className={containerClassName}>
          <Stack horizontalAlign="center">
            <Stack.Item style={{ width: props.isMobile ? mobileViewBannerWidth : desktopViewBannerWidth }}>
              <_CaptionsBanner
                {...captionsBannerProps}
                {...handlers}
                onRenderAvatar={onRenderAvatar}
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
      }
    </>
  );
};
