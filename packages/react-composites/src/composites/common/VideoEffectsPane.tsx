// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { useCallback } from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { Panel } from '@fluentui/react';
/* @conditional-compile-remove(video-background-effects) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(video-background-effects) */
import { _VideoBackgroundEffectsPicker, _VideoEffectsItemProps } from '@internal/react-components';
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
  const { showVideoEffectsOptions, setshowVideoEffectsOptions, adapter } = props;
  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();
  /* @conditional-compile-remove(video-background-effects) */
  const strings = locale.strings.call;
  /* @conditional-compile-remove(video-background-effects) */
  const selectableVideoEffects: _VideoEffectsItemProps[] = [
    {
      key: 'none',
      iconProps: {
        iconName: 'RemoveVideoBackgroundEffect'
      },
      title: strings.removeBackgroundEffect,
      tooltipProps: {
        content: strings.removeBackgroundTooltip
      }
    },
    {
      key: 'blur',
      iconProps: {
        iconName: 'BlurVideoBackground'
      },
      title: strings.blurBackgroundEffect,
      tooltipProps: {
        content: strings.blurBackgroundTooltip
      }
    }
  ];

  /* @conditional-compile-remove(video-background-effects) */
  const onEffectChange = useCallback(
    async (effectKey: string) => {
      if (effectKey === 'blur') {
        adapter.blurVideoBackground();
      } else if (effectKey === 'none') {
        adapter.stopVideoBackgroundEffect();
      }
    },
    [adapter]
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
  return (
    <Panel
      headerText="Effects"
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
