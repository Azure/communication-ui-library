// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * Add RTESendBox styles here
 */

/**
 * @private
 */
export const RTESendIconStyle = mergeStyles({
  width: '1.25rem',
  height: '1.25rem',
  margin: 'auto'
});

// /**
//  * @private
//  */
// export const sendButtonStyle = mergeStyles({
//     height: '2.25rem',
//     width: '2.25rem'
//   });

//   const mergedSendButtonStyle = useMemo(
//     () => mergeStyles(sendButtonStyle, styles?.sendMessageIconContainer),
//     [styles?.sendMessageIconContainer]
//   );

//   const mergedSendIconStyle = useMemo(
//     () =>
//       mergeStyles(
//         sendIconStyle,
//         {
//           color: !!errorMessage || !hasTextOrFile ? theme.palette.neutralTertiary : theme.palette.themePrimary
//         },
//         styles?.sendMessageIcon
//       ),
//     [errorMessage, hasTextOrFile, theme, styles?.sendMessageIcon]
//   );
