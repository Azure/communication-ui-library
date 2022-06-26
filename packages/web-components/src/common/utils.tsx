import { Constructable } from '@microsoft/fast-element';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import React from 'react';

// Common part
export type HandlerEventNameMappings<Events extends { [key: string]: any }> = {
  [K in keyof Events as `on${Capitalize<K extends string ? K : 'none'>}`]: K;
};

export type CustomEvent<DetailType> = Event & { detail: Exclude<DetailType, undefined> };

export type Handlers<Events extends { [key: string]: any }> = {
  [K in keyof Events as `on${Capitalize<K extends string ? K : 'none'>}`]: (event: CustomEvent<Events[K]>) => void;
};

export const wrapElementWithTypedReact = <Props, TElement extends HTMLElement, CustomEventMap>(
  element: Constructable<TElement>,
  eventMappings: HandlerEventNameMappings<CustomEventMap>
): ((props: Props & Handlers<CustomEventMap> & { children?: React.ReactNode }) => JSX.Element) => {
  const ReactWrapper = provideReactWrapper(React).wrap(element, {
    events: eventMappings as any
  });
  return (props) => {
    return <ReactWrapper {...(props as any)} />;
  };
};

export const createSlotWrapper = (slot: string): ((props: { children?: React.ReactNode }) => JSX.Element) => {
  return (props) => {
    return <div slot={slot}>{props.children}</div>;
  };
};
