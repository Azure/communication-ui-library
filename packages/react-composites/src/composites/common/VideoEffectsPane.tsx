// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useCallback, useMemo } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
/* @conditional-compile-remove(video-background-effects) */
import { useLocale } from '../localization';
import { ActiveErrorMessage, _VideoEffectsItemProps } from '@internal/react-components';
/* @conditional-compile-remove(video-background-effects) */
import { _VideoBackgroundEffectsPicker } from '@internal/react-components';
/* @conditional-compile-remove(video-background-effects) */
import {
  VideoBackgroundImage,
  VideoBackgroundBlurEffect,
  VideoBackgroundNoEffect,
  VideoBackgroundReplacementEffect
} from '../CallComposite';
/* @conditional-compile-remove(video-background-effects) */
import { activeVideoBackgroundEffectSelector } from '../CallComposite/selectors/activeVideoBackgroundEffectSelector';
/* @conditional-compile-remove(video-background-effects) */
import { useSelector } from '../CallComposite/hooks/useSelector';
/* @conditional-compile-remove(video-background-effects) */
import { useAdapter } from '../CallComposite/adapter/CallAdapterProvider';
/* @conditional-compile-remove(video-background-effects) */
import { localVideoSelector } from '../CallComposite/selectors/localVideoStreamSelector';
import { ActiveVideoEffect } from '../CallComposite/components/SidePane/useVideoEffectsPane';

/**
 * Pane that is used to show video effects button
 * @private
 */
/** @beta */
export const VideoEffectsPaneContent = (props: {
  activeVideoEffectError?: ActiveErrorMessage;
  onDismissError: (error: ActiveErrorMessage) => void;
  activeVideoEffectChange: (effect: ActiveVideoEffect) => void;
}): JSX.Element => {
  const {
    onDismissError,
    activeVideoEffectError,
    /* @conditional-compile-remove(video-background-effects) */
    activeVideoEffectChange
  } = props;
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();
  /* @conditional-compile-remove(video-background-effects) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(video-background-effects) */
  const strings = locale.strings.call;
  /* @conditional-compile-remove(video-background-effects) */
  const activeVideoEffects = useSelector(localVideoSelector).activeVideoEffects?.activeEffects;
  /* @conditional-compile-remove(video-background-effects) */
  const selectableVideoEffects: _VideoEffectsItemProps[] = useMemo(() => {
    const videoEffects: _VideoEffectsItemProps[] = [
      {
        itemKey: 'none',
        iconProps: {
          iconName: 'RemoveVideoBackgroundEffect'
        },
        title: strings.removeBackgroundEffectButtonLabel,
        tooltipProps: {
          content: strings.removeBackgroundTooltip
        }
      },
      {
        itemKey: 'blur',
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
          itemKey: img.key,
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
        activeVideoEffectChange({
          type: 'blur',
          timestamp: new Date(Date.now())
        });
        await adapter.startVideoBackgroundEffect(blurEffect);
        adapter.updateSelectedVideoBackgroundEffect(blurEffect);
      } else if (effectKey === 'none') {
        const noneEffect: VideoBackgroundNoEffect = {
          effectName: effectKey
        };
        await adapter.stopVideoBackgroundEffects();
        adapter.updateSelectedVideoBackgroundEffect(noneEffect);
      } else {
        const backgroundImg = selectableVideoEffects.find((effect) => {
          return effect.itemKey === effectKey;
        });
        if (backgroundImg && backgroundImg.backgroundProps) {
          const replaceEffect: VideoBackgroundReplacementEffect = {
            effectName: 'replacement',
            key: effectKey,
            backgroundImageUrl: backgroundImg.backgroundProps.url
          };
          activeVideoEffectChange({
            type: 'replacement',
            timestamp: new Date(Date.now())
          });
          await adapter.startVideoBackgroundEffect(replaceEffect);
          adapter.updateSelectedVideoBackgroundEffect(replaceEffect);
        }
      }
    },
    [adapter, activeVideoEffectChange, selectableVideoEffects]
  );

  /* @conditional-compile-remove(video-background-effects) */
  if (activeVideoEffectError && activeVideoEffects && activeVideoEffects.length === 0) {
    const noneEffect: VideoBackgroundNoEffect = {
      effectName: 'none'
    };
    adapter.updateSelectedVideoBackgroundEffect(noneEffect);
  }
  return VideoEffectsPaneTrampoline(
    onDismissError,
    activeVideoEffectError,
    /* @conditional-compile-remove(video-background-effects) */
    selectableVideoEffects,
    /* @conditional-compile-remove(video-background-effects) */
    onEffectChange
  );
};

const VideoEffectsPaneTrampoline = (
  onDismissError: (error: ActiveErrorMessage) => void,
  activeVideoEffectError?: ActiveErrorMessage,
  selectableVideoEffects?: _VideoEffectsItemProps[],
  onEffectChange?: (effectKey: string) => Promise<void>
): JSX.Element => {
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
      {activeVideoEffectError && isCameraOn && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => onDismissError(activeVideoEffectError)}>
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
