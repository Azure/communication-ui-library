// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChatAdapterState } from '../adapter/ChatAdapter';
import { useSelectorWithAdaptation } from './useAdaptedSelector';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder when the ChatClientProvide when refactor finished
export const useSelector = <SelectorT extends (state: ChatAdapterState, props: any) => any>(
  selector: SelectorT,
  selectorProps: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  // use selector with no adaptation
  return useSelectorWithAdaptation(selector, (state) => state, selectorProps);
};
