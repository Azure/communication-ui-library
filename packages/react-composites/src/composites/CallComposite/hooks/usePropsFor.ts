// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Common } from 'acs-ui-common';
import { DefaultCallingHandlers, getCallingSelector, GetCallingSelector } from 'calling-component-bindings';
import { useAdaptedSelector } from './useAdaptedSelector';
import { useHandlers } from './useHandlers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): ReturnType<GetCallingSelector<Component>> & Common<DefaultCallingHandlers, Parameters<Component>[0]> => {
  const selector = getCallingSelector(component);
  return { ...useAdaptedSelector(selector), ...useHandlers(component) };
};
