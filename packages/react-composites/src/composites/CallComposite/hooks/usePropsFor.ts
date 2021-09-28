// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Common } from '@internal/acs-ui-common';
import { CallingHandlers, getCallingSelector, GetCallingSelector } from '@internal/calling-component-bindings';
import { useAdaptedSelector } from './useAdaptedSelector';
import { useHandlers } from './useHandlers';

type Selector = (state: any, props: any) => any;

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetCallingSelector<Component> extends Selector
  ? ReturnType<GetCallingSelector<Component>> & Common<CallingHandlers, Parameters<Component>[0]>
  : Record<string, never> => {
  const selector = getCallingSelector(component);
  if (!selector) {
    throw new Error("Can't find the selector for component, please check supported component list");
  }
  return { ...useAdaptedSelector(selector as Selector), ...useHandlers(component) };
};
