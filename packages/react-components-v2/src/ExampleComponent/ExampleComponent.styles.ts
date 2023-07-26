// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExampleComponentProps } from './ExampleComponent.types';
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
 * Styles for the {@link ExampleComponent}.
 *
 * @returns classname
 *
 * @private
 */
export const useExampleComponentStyles = (props: ExampleComponentProps): string => {
  const internalStyles = useRootStyles();
  return mergeClasses(internalStyles.outline, props.className);
};
