// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

const videoBaseStyle = mergeStyles({
  border: 0
});

export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

export const aspectRatioBoxStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: 0,
  position: 'relative',
  paddingTop: '56.25%' /* default to 16:9 Aspect Ratio for now*/
});

export const aspectRatioBoxContentStyle = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

export const stackContainerStyle = mergeStyles({
  height: '100%',
  width: '15%'
});

export const screenShareContainerStyle = mergeStyles({
  height: '100%',
  width: '85%',
  position: 'relative'
});

export const stackContainerParticipantVideoStyles = {
  root: { borderRadius: 0 },
  videoContainer: { borderRadius: 0, '& video': { borderRadius: 0 } }
};
