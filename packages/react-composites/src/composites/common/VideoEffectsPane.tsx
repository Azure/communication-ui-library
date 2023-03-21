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
  showPanel: boolean;
  setShowPanel: (showPane: boolean) => void;
}): JSX.Element => {
  return VideoEffectsPaneTrampoline(props.showPanel, props.setShowPanel);
};

const VideoEffectsPaneTrampoline = (showPanel: boolean, setShowPanel: (showPane: boolean) => void): JSX.Element => {
  /* @conditional-compile-remove(video-background-effects) */
  return (
    <Panel
      headerText="Effects"
      isOpen={showPanel}
      onDismiss={() => setShowPanel(false)}
      hasCloseButton={true}
      closeButtonAriaLabel="Close"
      isLightDismiss={true}
    ></Panel>
  );
  return <></>;
};
