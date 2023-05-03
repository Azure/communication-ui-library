// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useState } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useCallback, useMemo } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
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
import { localVideoSelector } from '../CallComposite/selectors/localVideoStreamSelector';
/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
interface DismissedError {
  dismissedAt: Date;
  activeSince?: Date;
}

/**
 * Pane that is used to show video effects button
 * @private
 */
/** @beta */
export const VideoEffectsPaneContent = (): JSX.Element => {
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
    /* @conditional-compile-remove(video-background-effects) */
    selectableVideoEffects,
    /* @conditional-compile-remove(video-background-effects) */
    onEffectChange
  );
};

const VideoEffectsPaneTrampoline = (
  selectableVideoEffects?: _VideoEffectsItemProps[],
  onEffectChange?: (effectKey: string) => Promise<void>
): JSX.Element => {
  /* @conditional-compile-remove(video-background-effects) */
  const [dismissedError, setDismissedError] = useState<DismissedError>();
  /* @conditional-compile-remove(video-background-effects) */
  const latestEffectError = useSelector(videoBackgroundErrorsSelector);
  /* @conditional-compile-remove(video-background-effects) */
  const showError = latestEffectError && (!dismissedError || latestEffectError.timestamp > dismissedError.dismissedAt);
  /* @conditional-compile-remove(video-background-effects) */
  const selectedEffect = useSelector(activeVideoBackgroundEffectSelector);
  /* @conditional-compile-remove(video-background-effects) */
  const isCameraOn = useSelector(localVideoSelector).isAvailable;
  /* @conditional-compile-remove(video-background-effects) */
  const showWarning = !isCameraOn && selectedEffect !== 'none';
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();

  /* @conditional-compile-remove(video-background-effects) */
  return (
    <Stack horizontalAlign="center">
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
      <_VideoBackgroundEffectsPicker
        label={locale.strings.call.videoEffectsPaneBackgroundSelectionTitle}
        styles={backgroundPickerStyles}
        options={selectableVideoEffects ?? []}
        onChange={onEffectChange}
        selectedEffectKey={selectedEffect}
      />
    </Stack>
  );
  return <></>;
};

/* @conditional-compile-remove(video-background-effects) */
const backgroundPickerStyles = {
  label: {
    fontSize: '0.75rem',
    lineHeight: '0.5rem',
    fontWeight: '400'
  }
};

/* @conditional-compile-remove(video-background-effects) */
const dismissError = (toDismiss: AdapterError): DismissedError => {
  const now = new Date(Date.now());
  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this error was dismissed for the first time right now.
  return {
    dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
    activeSince: toDismiss.timestamp
  };
};
