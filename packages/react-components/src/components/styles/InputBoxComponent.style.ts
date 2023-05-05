// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, IStyle, FontWeights } from '@fluentui/react';

/**
 * @private
 */
export const inputBoxWrapperStyle = mergeStyles({
  padding: '0'
});

/**
 * @private
 */
export const inputBoxStyle = mergeStyles({
  overflow: 'auto',
  minHeight: '2.25rem', // prevents the input text box from being sized to 0px when the CallWithChatComposite chat pane is closed.
  maxHeight: '8.25rem',
  outline: 'red 5px',
  fontWeight: FontWeights.regular,
  fontSize: '0.875rem',
  width: '100%',
  height: '2.25rem',
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem'
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem'
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem'
  }
});

/**
 * @private
 */
export const inputBoxNewLineSpaceAffordance: IStyle = {
  marginBottom: '2rem'
};

/**
 *
 * @private
 */
export const textContainerStyle: IStyle = {
  alignSelf: 'center',
  position: 'relative',
  width: '100%'
};

/**
 * @private
 */
export const textFieldStyle: IStyle = {
  root: {
    width: '100%',
    minHeight: '0',
    fontSize: '8.25rem'
  },
  wrapper: {},
  fieldGroup: {
    outline: 'none',
    border: 'none',
    height: 'auto',
    minHeight: '0',
    /**
     * Removing fieldGroup border to make sure no border is rendered around the text area in sendbox.
     */
    ':after': { border: 'none' }
  },
  field: {
    borderRadius: '0.25rem'
  }
};

/**
 * @private
 */
export const inputButtonStyle = mergeStyles({
  color: 'grey',
  margin: 'auto',
  width: '1.0625rem',
  height: '1.0625rem',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

/**
 * @private
 */
export const newLineButtonsContainerStyle: IStyle = {
  position: 'absolute',
  right: '0.8rem',
  bottom: '0.8rem',
  gap: '1rem'
};

/**
 * @private
 */
export const inputButtonTooltipStyle = mergeStyles({
  // The toolTip host container show be a flex box, so that alignItems: 'center' works for inside buttons
  display: 'flex'
});

/**
 * @private
 */
export const iconWrapperStyle = mergeStyles({
  // VoiceOver fix: Avoid rerender of DefaultButton above that handles clicking and hovering by keeping rerendering icon separate
  pointerEvents: 'none'
});
