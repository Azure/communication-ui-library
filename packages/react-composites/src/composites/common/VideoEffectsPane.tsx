// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useCallback, useMemo } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { Panel } from '@fluentui/react';
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
import { CallAdapter, CommonCallAdapter } from '../CallComposite';

/**
 * Pane that is used to show video effects button
 * @private
 */
/** @beta */
export const VideoEffectsPane = (props: {
  showVideoEffectsOptions: boolean;
  setshowVideoEffectsOptions: (showVideoEffectsOptions: boolean) => void;
  adapter: CallAdapter | CommonCallAdapter;
}): JSX.Element => {
  const { showVideoEffectsOptions, setshowVideoEffectsOptions } = props;
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();
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
    const videoEffectImages = props.adapter.getState().videoBackgroundImages;

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
  }, [strings, props.adapter]);

  /* @conditional-compile-remove(video-background-effects) */
  const onEffectChange = useCallback(
    async (effectKey: string) => {
      if (effectKey === 'blur') {
        props.adapter.blurVideoBackground();
        const blurEffect: VideoBackgroundBlurEffect = {
          effectName: effectKey
        };
        props.adapter.updateSelectedVideoBackgroundEffect(blurEffect);
      } else if (effectKey === 'none') {
        props.adapter.stopVideoBackgroundEffect();
        const noneEffect: VideoBackgroundNoneEffect = {
          effectName: effectKey
        };
        props.adapter.updateSelectedVideoBackgroundEffect(noneEffect);
      } else {
        const backgroundImg = selectableVideoEffects.find((effect) => {
          return effect.key === effectKey;
        });
        if (backgroundImg && backgroundImg.backgroundProps) {
          props.adapter.replaceVideoBackground({ backgroundImageUrl: backgroundImg.backgroundProps.url });
          const replaceEffect: VideoBackgroundReplacementEffect = {
            effectName: 'replacement',
            effectKey,
            backgroundImageUrl: backgroundImg.backgroundProps.url
          };
          props.adapter.updateSelectedVideoBackgroundEffect(replaceEffect);
        }
      }
    },
    [props.adapter, selectableVideoEffects]
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
  const locale = useLocale();
  /* @conditional-compile-remove(video-background-effects) */
  return (
    <Panel
      headerText={locale.strings.call.effects}
      isOpen={showVideoEffectsOptions}
      onDismiss={() => setshowVideoEffectsOptions(false)}
      hasCloseButton={true}
      closeButtonAriaLabel="Close"
      isLightDismiss={true}
    >
      {selectableVideoEffects && (
        <_VideoBackgroundEffectsPicker
          options={selectableVideoEffects}
          onChange={onEffectChange}
        ></_VideoBackgroundEffectsPicker>
      )}
    </Panel>
  );
  return <></>;
};
