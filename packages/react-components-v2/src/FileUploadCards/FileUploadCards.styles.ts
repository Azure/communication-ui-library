// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _FileUploadCardsProps } from './FileUploadCards.types';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

const useRootStyles = makeStyles({
  outline: {
    backgroundColor: tokens.colorTransparentBackground,

    ':hover': {
      backgroundColor: tokens.colorTransparentBackgroundHover
    },

    ':hover:active': {
      backgroundColor: tokens.colorTransparentBackgroundPressed
    }
  }
});

/**
 * Styles for the {@link _FileUploadCards}.
 *
 * @returns classname
 *
 * @internal
 */
export const useFileUploadCardsStyles = (props: _FileUploadCardsProps): string => {
  const internalStyles = useRootStyles();
  return mergeClasses(internalStyles.outline, props.className);
};
