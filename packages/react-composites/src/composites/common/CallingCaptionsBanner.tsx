// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { CaptionsBanner, CaptionsBannerStrings, CustomAvatarOptions } from '@internal/react-components';
/* @conditional-compile-remove(composite-onRenderAvatar-API) */
import { OnRenderAvatarCallback } from '@internal/react-components';
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
  /* @conditional-compile-remove(composite-onRenderAvatar-API) */
  onRenderAvatar?: OnRenderAvatarCallback;
  captionsOptions?: {
    height: 'full' | 'default';
  };
  /* @conditional-compile-remove(rtt) */
  isRealTimeTextOn?: boolean;
}): JSX.Element => {
  const { onFetchAvatarPersonaData, /* @conditional-compile-remove(composite-onRenderAvatar-API) */ onRenderAvatar } =
    props;
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
    /* @conditional-compile-remove(rtt) */
    realTimeTextInputBoxDefaultText: strings.realTimeTextInputBoxDefaultText,
    /* @conditional-compile-remove(rtt) */
    realTimeTextInputErrorMessage: strings.realTimeTextInputErrorMessage,
    /* @conditional-compile-remove(rtt) */
    realTimeTextBannerContent: strings.realTimeTextBannerContent,
    /* @conditional-compile-remove(rtt) */
    realTimeTextBannerTitle: strings.realTimeTextBannerTitle,
    /* @conditional-compile-remove(rtt) */
    realTimeTextBannerLinkLabel: strings.realTimeTextBannerLinkLabel,
    /* @conditional-compile-remove(rtt) */
    captionsOnlyContainerTitle: strings.captionsOnlyContainerTitle,
    /* @conditional-compile-remove(rtt) */
    realTimeTextOnlyContainerTitle: strings.realTimeTextOnlyContainerTitle,
    /* @conditional-compile-remove(rtt) */
    captionsAndRealTimeTextContainerTitle: strings.captionsAndRealTimeTextContainerTitle,
    /* @conditional-compile-remove(rtt) */
    expandButtonAriaLabel: strings.expandButtonAriaLabel,
    /* @conditional-compile-remove(rtt) */
    minimizeButtonAriaLabel: strings.minimizeButtonAriaLabel
  };

  const defaultOnRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return <AvatarPersona userId={userId} {...options} dataProvider={onFetchAvatarPersonaData} />;
    },
    [onFetchAvatarPersonaData]
  );

  const onRenderAvatarCallback = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      /* @conditional-compile-remove(composite-onRenderAvatar-API) */
      if (onRenderAvatar) {
        const defaultOnRenderAvatarWrapper = (options: CustomAvatarOptions): JSX.Element => {
          return defaultOnRenderAvatar(userId, options);
        };
        return onRenderAvatar(userId, options, defaultOnRenderAvatarWrapper);
      }
      return defaultOnRenderAvatar(userId, options);
    },
    [defaultOnRenderAvatar, /* @conditional-compile-remove(composite-onRenderAvatar-API) */ onRenderAvatar]
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
        <CallingCaptionsSettingsModal
          showCaptionsSettingsModal={isCaptionsSettingsOpen}
          onDismissCaptionsSettings={onDismissCaptionsSettings}
          changeCaptionLanguage={props.useTeamsCaptions}
        />
      )}
      {
        <div className={containerClassName} role="region" aria-label={strings.liveCaptionsLabel}>
          <Stack horizontalAlign="center">
            <Stack.Item style={{ width: props.isMobile ? mobileViewBannerWidth : desktopViewBannerWidth }}>
              <CaptionsBanner
                captionsOptions={props.captionsOptions}
                onRenderAvatar={onRenderAvatarCallback}
                formFactor={props.isMobile ? 'compact' : 'default'}
                strings={captionsBannerStrings}
                {...captionsBannerProps}
                /* @conditional-compile-remove(rtt) */
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
