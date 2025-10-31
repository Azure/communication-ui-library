// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { CaptionsBanner, CaptionsBannerStrings, CustomAvatarOptions } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { mergeStyles, Stack } from '@fluentui/react';
import { CallingCaptionsSettingsModal } from './CallingCaptionsSettingsModal';
import { CaptionsBannerMoreButton } from './CaptionsBannerMoreButton';
import { useLocale } from '../localization';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

const mobileViewBannerWidth = '95%';

/** @private */
export const CallingCaptionsBanner = (props: {
  isMobile: boolean;
  useTeamsCaptions?: boolean;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  captionsOptions?: {
    height: 'full' | 'default';
  };
  isRealTimeTextOn?: boolean;
}): JSX.Element => {
  const captionsBannerProps = usePropsFor(CaptionsBanner);
  const [isCaptionsSettingsOpen, setIsCaptionsSettingsOpen] = useState<boolean>(false);

  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(true);
  };

  const onDismissCaptionsSettings = (): void => {
    setIsCaptionsSettingsOpen(false);
  };

  const containerClassName = mergeStyles(
    props.captionsOptions?.height === 'full'
      ? mergeStyles({
          position: 'absolute',
          height: '100%',
          width: '100%'
        })
      : { position: 'relative' }
  );

  const floatingChildClassName = mergeStyles({
    position: 'absolute',
    right: 0,
    top: 0
  });

  const strings = useLocale().strings.call;

  const captionsBannerStrings: CaptionsBannerStrings = {
    captionsBannerSpinnerText: strings.captionsBannerSpinnerText,

    realTimeTextInputBoxDefaultText: strings.realTimeTextInputBoxDefaultText,

    realTimeTextInputErrorMessage: strings.realTimeTextInputErrorMessage,

    realTimeTextBannerContent: strings.realTimeTextBannerContent,

    realTimeTextBannerTitle: strings.realTimeTextBannerTitle,

    realTimeTextBannerLinkLabel: strings.realTimeTextBannerLinkLabel,

    captionsOnlyContainerTitle: strings.captionsOnlyContainerTitle,

    realTimeTextOnlyContainerTitle: strings.realTimeTextOnlyContainerTitle,

    captionsAndRealTimeTextContainerTitle: strings.captionsAndRealTimeTextContainerTitle,

    expandButtonAriaLabel: strings.expandButtonAriaLabel,

    minimizeButtonAriaLabel: strings.minimizeButtonAriaLabel
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

  const containerAriaLabel = // 3 cases, captions only, RTT only, captions + RTT we adjust the aria-label accordingly
    captionsBannerProps.isCaptionsOn && !(props.isRealTimeTextOn || captionsBannerProps.isRealTimeTextOn)
      ? strings.liveCaptionsLabel
      : !captionsBannerProps.isCaptionsOn && (props.isRealTimeTextOn || captionsBannerProps.isRealTimeTextOn)
        ? strings.realTimeTextLabel
        : strings.captionsAndRealTimeTextContainerTitle;

  return (
    <>
      {isCaptionsSettingsOpen && (
        <CallingCaptionsSettingsModal
          showCaptionsSettingsModal={isCaptionsSettingsOpen}
          onDismissCaptionsSettings={onDismissCaptionsSettings}
          changeCaptionLanguage={props.useTeamsCaptions}
        />
      )}
      {
        <div className={containerClassName} role="region" aria-label={containerAriaLabel}>
          <Stack horizontalAlign="center">
            <Stack.Item style={{ width: props.isMobile ? mobileViewBannerWidth : desktopViewBannerWidth }}>
              <CaptionsBanner
                captionsOptions={props.captionsOptions}
                onRenderAvatar={onRenderAvatar}
                formFactor={props.isMobile ? 'compact' : 'default'}
                strings={captionsBannerStrings}
                {...captionsBannerProps}
                isRealTimeTextOn={props.isRealTimeTextOn || captionsBannerProps.isRealTimeTextOn}
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
