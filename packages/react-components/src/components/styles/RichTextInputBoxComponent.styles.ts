// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IStyle, Theme, mergeStyles } from '@fluentui/react';
import {
  borderEditBoxStyle,
  defaultSendBoxActiveBorderThicknessREM,
  defaultSendBoxInactiveBorderThicknessREM
} from './SendBox.styles';

/**
 * @private
 */
export const inputBoxRichTextStackStyle = mergeStyles({ overflow: 'hidden' });

/**
 * @private
 */
export const inputBoxRichTextStackItemStyle = mergeStyles({ paddingBottom: '0.25rem' });

/**
 * @private
 */
export const inputBoxContentStackStyle = mergeStyles({ overflow: 'hidden' });

/**
 * @private
 */
export const richTextBorderBoxStyle = (props: { theme: Theme; disabled: boolean }): string => {
  const disabledStyles: IStyle = {
    pointerEvents: 'none',
    backgroundColor: props.theme.palette.neutralLighter,
    borderRadius: props.theme.effects.roundedCorner4,
    border: `${defaultSendBoxInactiveBorderThicknessREM}rem solid transparent`,
    margin: `${defaultSendBoxActiveBorderThicknessREM - defaultSendBoxInactiveBorderThicknessREM}rem`
  };
  return mergeStyles(
    props.disabled
      ? disabledStyles
      : borderEditBoxStyle({
          ...props,
          // should always be false as we don't want to show the border when there is an error
          hasErrorMessage: false,
          defaultBorderColor: props.theme.palette.neutralSecondary
        })
  );
};
