// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useCallback, useMemo } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { MessageBar, MessageBarType, Panel, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(video-background-effects) */
import { useLocale } from '../localization';
import { _VideoEffectsItemProps } from '@internal/react-components';
/* @conditional-compile-remove(video-background-effects) */
import { _VideoBackgroundEffectsPicker } from '@internal/react-components';
/* @conditional-compile-remove(video-background-effects) */
import {
  VideoBackgroundImage,
  VideoBackgroundBlurEffect,
  VideoBackgroundNoneEffect,
  VideoBackgroundReplacementEffect
} from '../CallComposite';
/* @conditional-compile-remove(video-background-effects) */
import { activeVideoBackgroundEffectSelector } from '../CallComposite/selectors/activeVideoBackgroundEffectSelector';
/* @conditional-compile-remove(video-background-effects) */
import { useSelector } from '../CallComposite/hooks/useSelector';
/* @conditional-compile-remove(video-background-effects) */
import { useAdapter } from '../CallComposite/adapter/CallAdapterProvider';
/* @conditional-compile-remove(video-background-effects) */
import { videoBackgroundErrorsSelector } from '../CallComposite/selectors/videoBackgroundErrorsSelector';
/* @conditional-compile-remove(video-background-effects) */
import { AdapterError } from './adapters';

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
interface DismissedError {
  dismissedAt: Date;
  activeSince?: Date;
}
import { localVideoSelector } from '../CallComposite/selectors/localVideoStreamSelector';

/**
 * Pane that is used to show video effects button
 * @private
 */
/** @beta */
export const VideoEffectsPane = (props: {
  showVideoEffectsOptions: boolean;
  setshowVideoEffectsOptions: (showVideoEffectsOptions: boolean) => void;
}): JSX.Element => {
  const { showVideoEffectsOptions, setshowVideoEffectsOptions } = props;
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();
  /* @conditional-compile-remove(video-background-effects) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(video-background-effects) */
  const strings = locale.strings.call;
  /* @conditional-compile-remove(video-background-effects) */
  const selectableVideoEffects: _VideoEffectsItemProps[] = useMemo(() => {
    const videoEffects: _VideoEffectsItemProps[] = [
      {
        key: 'none',
        iconProps: {
          iconName: 'RemoveVideoBackgroundEffect'
        },
        title: strings.removeBackgroundEffectButtonLabel,
        tooltipProps: {
          content: strings.removeBackgroundTooltip
        }
      },
      {
        key: 'blur',
        iconProps: {
          iconName: 'BlurVideoBackground'
        },
        title: strings.blurBackgroundEffectButtonLabel,
        tooltipProps: {
          content: strings.blurBackgroundTooltip
        }
      }
    ];
    const videoEffectImages = adapter.getState().videoBackgroundImages;

    if (videoEffectImages) {
      videoEffectImages.forEach((img: VideoBackgroundImage) => {
        videoEffects.push({
          key: img.key,
          backgroundProps: {
            url: img.url
          },
          tooltipProps: {
            content: img.tooltipText ?? ''
          }
        });
      });
    }
    return videoEffects;
  }, [strings, adapter]);

  /* @conditional-compile-remove(video-background-effects) */
  const onEffectChange = useCallback(
    async (effectKey: string) => {
      if (effectKey === 'blur') {
        const blurEffect: VideoBackgroundBlurEffect = {
          effectName: effectKey
        };
        adapter.updateSelectedVideoBackgroundEffect(blurEffect);
        await adapter.blurVideoBackground();
      } else if (effectKey === 'none') {
        const noneEffect: VideoBackgroundNoneEffect = {
          effectName: effectKey
        };
        adapter.updateSelectedVideoBackgroundEffect(noneEffect);
        await adapter.stopVideoBackgroundEffect();
      } else {
        const backgroundImg = selectableVideoEffects.find((effect) => {
          return effect.key === effectKey;
        });
        if (backgroundImg && backgroundImg.backgroundProps) {
          const replaceEffect: VideoBackgroundReplacementEffect = {
            effectName: 'replacement',
            effectKey,
            backgroundImageUrl: backgroundImg.backgroundProps.url
          };
          adapter.updateSelectedVideoBackgroundEffect(replaceEffect);
          await adapter.replaceVideoBackground({ backgroundImageUrl: backgroundImg.backgroundProps.url });
        }
      }
    },
    [adapter, selectableVideoEffects]
  );
  return VideoEffectsPaneTrampoline(
    showVideoEffectsOptions,
    setshowVideoEffectsOptions,
    /* @conditional-compile-remove(video-background-effects) */
    selectableVideoEffects,
    /* @conditional-compile-remove(video-background-effects) */
    onEffectChange
  );
};

const VideoEffectsPaneTrampoline = (
  showVideoEffectsOptions: boolean,
  setshowVideoEffectsOptions: (showVideoEffectsOptions: boolean) => void,
  selectableVideoEffects?: _VideoEffectsItemProps[],
  onEffectChange?: (effectKey: string) => Promise<void>
): JSX.Element => {
  /* @conditional-compile-remove(video-background-effects) */
  const [dismissedError, setDismissedError] = useState<DismissedError>();
  /* @conditional-compile-remove(video-background-effects) */
  const latestEffectError = useSelector(videoBackgroundErrorsSelector);
  /* @conditional-compile-remove(video-background-effects) */
  let showError = false;
  /* @conditional-compile-remove(video-background-effects) */
  if (latestEffectError) {
    if (dismissedError) {
      showError = latestEffectError?.timestamp > dismissedError.dismissedAt;
    } else {
      showError = true;
    }
  }
  /* @conditional-compile-remove(video-background-effects) */
  useEffect(() => setDismissedError(dismissedError), [dismissedError]);
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();
  /* @conditional-compile-remove(video-background-effects) */
  const selectedEffect = useSelector(activeVideoBackgroundEffectSelector);
  /* @conditional-compile-remove(video-background-effects) */
  const isCameraOn = useSelector(localVideoSelector).isAvailable;
  /* @conditional-compile-remove(video-background-effects) */
  const showWarning = !isCameraOn && selectedEffect !== 'none';
  /* @conditional-compile-remove(video-background-effects) */
  const headerStyles = {
    zIndex: 0
  };

  /* @conditional-compile-remove(video-background-effects) */
  return (
    <Panel
      headerText={locale.strings.call.effects}
      isOpen={showVideoEffectsOptions}
      onDismiss={() => setshowVideoEffectsOptions(false)}
      hasCloseButton={true}
      closeButtonAriaLabel="Close"
      isLightDismiss={true}
      className={mergeStyles(headerStyles)}
    >
      {showError && latestEffectError && (
        <MessageBar
          messageBarType={MessageBarType.error}
          onDismiss={() => setDismissedError(dismissError(latestEffectError))}
        >
          {locale.strings.call.unableToStartVideoEffect}
        </MessageBar>
      )}
      {showWarning && (
        <MessageBar messageBarType={MessageBarType.warning}>
          {locale.strings.call.cameraOffBackgroundEffectWarningText}
        </MessageBar>
      )}
      {selectableVideoEffects && (
        <_VideoBackgroundEffectsPicker
          options={selectableVideoEffects}
          onChange={onEffectChange}
          selectedEffectKey={selectedEffect}
        ></_VideoBackgroundEffectsPicker>
      )}
    </Panel>
  );
  return <></>;
};

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export const dismissError = (toDismiss: AdapterError): DismissedError => {
  const now = new Date(Date.now());
  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this error was dismissed for the first time right now.
  return {
    dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
    activeSince: toDismiss.timestamp
  };
};
