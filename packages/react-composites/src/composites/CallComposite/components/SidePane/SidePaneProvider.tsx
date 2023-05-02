// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

/** @private */
export interface SidePaneRenderer {
  /** Side pane header content to render */
  headerRenderer?: () => JSX.Element;
  /** Side pane body content to render */
  contentRenderer?: () => JSX.Element;
  /** An id for identifying the side pane in events like `onSidePaneIdChanged` */
  id: string;
}

/** @private */
export type InjectedSidePaneProps = {
  renderer: SidePaneRenderer;
  /**
   * Whether the side pane showing the override content is displayed
   */
  isActive: boolean;
  /**
   * Useful to ensure the side pane renders the content of the override even if the side pane is closed.
   * This avoids remounting the content when the side pane is opened again.
   * This typically improves performance of opening the side pane, but may impact the overall performance of the app.
   *
   * @default false
   */
  persistRenderingWhenClosed?: boolean;
};

interface SidePaneContextProps {
  sidePaneRenderer?: SidePaneRenderer;
  overrideSidePane?: InjectedSidePaneProps;
}

/**
 * Context for side pane interaction
 *
 * @private
 */
export const SidePaneContext = createContext<SidePaneContextProps>({});

/**
 * Props to LocalizationProvider
 *
 * @private
 */
export type SidePaneProviderProps = SidePaneContextProps & {
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's composites.
 *
 * @private
 */
export const SidePaneProvider = (props: SidePaneProviderProps): JSX.Element => {
  return <SidePaneContext.Provider value={props}>{props.children}</SidePaneContext.Provider>;
};

/** @private */
export const useSidePaneContext = (): SidePaneContextProps => useContext(SidePaneContext);

/** @private */
export const useIsSidePaneOpen = (): boolean => {
  const { sidePaneRenderer, overrideSidePane } = useSidePaneContext();
  return !!(sidePaneRenderer || overrideSidePane?.isActive);
};

/** @private */
export const useIsParticularSidePaneOpen = (sidePaneId: string): boolean => {
  const isSidePaneOpen = useIsSidePaneOpen();
  const { sidePaneRenderer } = useSidePaneContext();
  return isSidePaneOpen && sidePaneRenderer?.id === sidePaneId;
};
