// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { _CaptionsBanner, _CaptionsBannerStrings, CustomAvatarOptions } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { mergeStyles, Stack } from '@fluentui/react';
import { CaptionsSettingsModal } from './CaptionsSettingsModal';
import { CaptionsBannerMoreButton } from './CaptionsBannerMoreButton';
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { _captionsBannerSelector } from '@internal/calling-component-bindings';
import { useLocale } from '../localization';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';

const mobileViewBannerWidth = '90%';

/** @private */
export const CaptionsBanner = (props: {
  isMobile: boolean;
  useTeamsCaptions?: boolean;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}): JSX.Element => {
  const captionsBannerProps = useAdaptedSelector(_captionsBannerSelector);

  const handlers = useHandlers(_CaptionsBanner);

  const [isCaptionsSettingsOpen, setIsCaptionsSettingsOpen] = useState<boolean>(false);

  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(true);
  };

  const onDismissCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(false);
  };

  const containerClassName = mergeStyles({
    position: 'relative'
  });

  const floatingChildClassName = mergeStyles({
    position: 'absolute',
    right: 0,
    top: 0
  });

  const strings = useLocale().strings.call;

  const captionsBannerStrings: _CaptionsBannerStrings = {
    captionsBannerSpinnerText: strings.captionsBannerSpinnerText
  };

  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />;
    },
    [props.onFetchAvatarPersonaData]
  );

  const { innerWidth: width } = window;

  const [windowWidth, setWindowWidth] = useState(width);

  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopViewBannerWidth = windowWidth > 620 ? '35rem' : '80%';

  return (
    <>
      {isCaptionsSettingsOpen && (
        <CaptionsSettingsModal
          showCaptionsSettingsModal={isCaptionsSettingsOpen}
          onDismissCaptionsSettings={onDismissCaptionsSettings}
          changeCaptionLanguage={props.useTeamsCaptions}
        />
      )}
      {
        <div className={containerClassName}>
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
