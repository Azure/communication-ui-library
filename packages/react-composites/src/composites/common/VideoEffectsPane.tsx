// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(video-background-effects) */
import { Panel } from '@fluentui/react';

/**
 * Pane that is used to show video effects button
 * @private
 */
/** @beta */
export const VideoEffectsPane = (props: {
  showVideoEffectsOptions: boolean;
  setshowVideoEffectsOptions: (showVideoEffectsOptions: boolean) => void;
}): JSX.Element => {
  return VideoEffectsPaneTrampoline(props.showVideoEffectsOptions, props.setshowVideoEffectsOptions);
};

const VideoEffectsPaneTrampoline = (
  showVideoEffectsOptions: boolean,
  setshowVideoEffectsOptions: (showVideoEffectsOptions: boolean) => void
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
    ></Panel>
  );
  return <></>;
};
