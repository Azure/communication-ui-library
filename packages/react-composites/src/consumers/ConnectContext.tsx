// © Microsoft Corporation. All rights reserved.

import React, { ReactElement } from 'react';

type ContextMapFuncReturns<FuncTypes extends any[]> = {
  [P in keyof FuncTypes]-?: FuncTypes[P] extends (...args: any) => infer R ? R : never;
};

type UnionTypesOfTuple<T> = T[keyof T extends number ? keyof T : never];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type InteractTuple<T> = UnionToIntersection<UnionTypesOfTuple<T>>;

type ExpandReturnTypes<T extends any[]> = InteractTuple<ContextMapFuncReturns<T>>;

type ContextMapFuncArgs<FuncTypes extends any[]> = {
  [P in keyof FuncTypes]-?: FuncTypes[P] extends (ownProps: infer R) => any ? (R extends {} ? R : {}) : {};
};

type ExpandArgTypes<T extends any[]> = InteractTuple<ContextMapFuncArgs<T>>;

/**
 * This function allows react components to make use of the Composable SDK functionality.
 * By passing in an element to connect and mapToComponentProps functions the element is able to
 * utilize the Composable SDK by simply calling this.props.<function>.
 * @param ElementToConnect - React class or component that wants to make use of context functionality.
 * @param mapToComponentProps - Functions that map context functionality to element props.
 */
export const connectFuncsToContext = <
  FuncTypes extends ((ownProps: any) => any)[],
  PropsForComponent extends ExpandReturnTypes<FuncTypes>
>(
  ElementToConnect: (props: PropsForComponent) => ReactElement | null,
  ...mapToComponentFuncs: FuncTypes
): ((
  props: ExpandArgTypes<FuncTypes> & Omit<PropsForComponent, keyof ExpandReturnTypes<FuncTypes>>
) => ReactElement) => (
  props: Omit<PropsForComponent, keyof ExpandReturnTypes<FuncTypes>> & ExpandArgTypes<FuncTypes>
) => {
  let propsFromContext = {};
  for (const mapToComponentProps of mapToComponentFuncs) {
    propsFromContext = { ...mapToComponentProps(props), ...propsFromContext };
  }

  return <ElementToConnect {...({ ...propsFromContext, ...(props as any) } as any)} />;
};
