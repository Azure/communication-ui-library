// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SendBoxProps } from './SendBox.types';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

const useRootStyles = makeStyles({
  root: {}
});

/**
 * Styles for the {@link SendBox}.
 *
 * @returns className for ExampleComponent.
 *
 * @private
 */
export const useExampleComponentStyles = (props: SendBoxProps): string => {
  const internalStyles = useRootStyles();
  return mergeClasses(internalStyles.root, props.className);
};
