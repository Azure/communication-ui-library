// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChatAdapterState } from '../adapter/ChatAdapter';
import { useSelectorWithAdaptation } from './useAdaptedSelector';

/**
 * @private
 */
export const useSelector = <SelectorT extends (state: ChatAdapterState, props: any) => any>(
  selector: SelectorT,
  selectorProps: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  // use selector with no adaptation
  return useSelectorWithAdaptation(selector, (state) => state, selectorProps);
};
