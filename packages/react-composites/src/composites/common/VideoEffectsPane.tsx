// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { useCallback, useMemo } from 'react';

import { MessageBar, MessageBarType, Stack, mergeStyles } from '@fluentui/react';

import { useLocale } from '../localization';
import { ActiveErrorMessage, _VideoEffectsItemProps } from '@internal/react-components';

import { _VideoBackgroundEffectsPicker } from '@internal/react-components';

import {
  VideoBackgroundImage,
  VideoBackgroundBlurEffect,
  VideoBackgroundNoEffect,
  VideoBackgroundReplacementEffect
} from '../CallComposite';

import { activeVideoBackgroundEffectSelector } from '../CallComposite/selectors/activeVideoBackgroundEffectSelector';

import { useSelector } from '../CallComposite/hooks/useSelector';

import { useAdapter } from '../CallComposite/adapter/CallAdapterProvider';

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
  updateFocusHandle: React.RefObject<{
    focus: () => void;
  }>;
  backgroundImages: VideoBackgroundImage[] | undefined;
}): JSX.Element => {
  const { onDismissError, activeVideoEffectError, activeVideoEffectChange } = props;

  const locale = useLocale();

  const adapter = useAdapter();

  const strings = locale.strings.call;

  const activeVideoEffects = useSelector(localVideoSelector).activeVideoEffects?.activeEffects;

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

    if (props.backgroundImages) {
      props.backgroundImages.forEach((img: VideoBackgroundImage) => {
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
  }, [
    strings.removeBackgroundEffectButtonLabel,
    strings.removeBackgroundTooltip,
    strings.blurBackgroundEffectButtonLabel,
    strings.blurBackgroundTooltip,
    props.backgroundImages
  ]);

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

  if (activeVideoEffectError && activeVideoEffects && activeVideoEffects.length === 0) {
    const noneEffect: VideoBackgroundNoEffect = {
      effectName: 'none'
    };
    adapter.updateSelectedVideoBackgroundEffect(noneEffect);
  }

  return VideoEffectsPaneTrampoline(
    onDismissError,
    props.updateFocusHandle,
    activeVideoEffectError,
    selectableVideoEffects,
    onEffectChange
  );
};

const VideoEffectsPaneTrampoline = (
  onDismissError: (error: ActiveErrorMessage) => void,
  updateFocusHandle: React.RefObject<{
    focus: () => void;
  }>,
  activeVideoEffectError?: ActiveErrorMessage,
  selectableVideoEffects?: _VideoEffectsItemProps[],
  onEffectChange?: (effectKey: string) => Promise<void>
): JSX.Element => {
  const selectedEffect = useSelector(activeVideoBackgroundEffectSelector);

  const isCameraOn = useSelector(localVideoSelector).isAvailable;

  const showWarning = !isCameraOn && selectedEffect !== 'none';

  const locale = useLocale();

  return (
    <Stack tokens={{ childrenGap: '0.75rem' }} className={mergeStyles({ paddingLeft: '0.5rem' })}>
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
        componentRef={updateFocusHandle}
      />
    </Stack>
  );
  return <></>;
};

const backgroundPickerStyles = {
  label: {
    fontSize: '0.75rem',
    lineHeight: '0.5rem',
    fontWeight: '400'
  }
};
