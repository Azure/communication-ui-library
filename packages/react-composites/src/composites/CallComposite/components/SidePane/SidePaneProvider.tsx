// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

/** @private */
export type InjectedSidePaneProps = {
  headerRenderer?: () => JSX.Element;
  contentRenderer?: () => JSX.Element;
  /** An id for identifying the side pane in events like onSidePaneIdChanged */
  sidePaneId: string;
  /**
   * Whether the side pane showing the override content is displayed
   * @default false
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

interface SidePaneProps {
  /** Side pane header */
  setHeaderRenderer: React.Dispatch<React.SetStateAction<(() => JSX.Element) | undefined>>;
  headerRenderer?: () => JSX.Element;
  /** Side pane content */
  setContentRenderer: React.Dispatch<React.SetStateAction<(() => JSX.Element) | undefined>>;
  contentRenderer?: () => JSX.Element;
  /** tracking open state of the side pane */
  setActiveSidePaneId: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeSidePaneId: string | undefined;
  /** Support injecting content into the side pane from extrnal sources (e.g. CallWithChatComposite's Chat) */
  setOverrideSidePane: React.Dispatch<React.SetStateAction<InjectedSidePaneProps | undefined>>;
  overrideSidePane?: InjectedSidePaneProps;
}

const defaultSidePaneProps: SidePaneProps = {
  setHeaderRenderer: () => () => <></>,
  setContentRenderer: () => () => <></>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setActiveSidePaneId: () => {},
  activeSidePaneId: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setOverrideSidePane: () => {},
  overrideSidePane: undefined
};

/**
 * Context for side pane interaction
 *
 * @private
 */
export const SidePaneContext = createContext<SidePaneProps>(defaultSidePaneProps);

/**
 * Props to LocalizationProvider
 *
 * @private
 */
export type SidePaneProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's composites.
 *
 * @private
 */
export const SidePaneProvider = (props: SidePaneProviderProps): JSX.Element => {
  const [headerRenderer, setHeaderRenderer] = React.useState<(() => JSX.Element) | undefined>();
  const [contentRenderer, setContentRenderer] = React.useState<(() => JSX.Element) | undefined>();
  const [activeSidePaneId, setActiveSidePaneId] = React.useState<string>();
  const [overrideSidePane, setOverrideSidePane] = React.useState<InjectedSidePaneProps>();

  const providerProps = useMemo(
    () => ({
      headerRenderer,
      setHeaderRenderer,
      contentRenderer,
      setContentRenderer,
      activeSidePaneId,
      setActiveSidePaneId,
      overrideSidePane,
      setOverrideSidePane
    }),
    [headerRenderer, contentRenderer, activeSidePaneId, overrideSidePane]
  );

  return <SidePaneContext.Provider value={providerProps}>{props.children}</SidePaneContext.Provider>;
};

/** @private */
export const useSidePaneContext = (): SidePaneProps => useContext(SidePaneContext);

/** @private */
export const useOpenSidePane = (
  sidePaneId: string,
  onRenderHeader: () => JSX.Element,
  onRenderContent: () => JSX.Element
): {
  isOpen: boolean;
  openPane: () => void;
} => {
  const { setHeaderRenderer, setContentRenderer, setActiveSidePaneId, activeSidePaneId, overrideSidePane } =
    useSidePaneContext();

  const isOpen = activeSidePaneId === sidePaneId && !overrideSidePane?.isActive;

  const updateRenderers = useCallback((): void => {
    setHeaderRenderer(() => onRenderHeader);
    setContentRenderer(() => onRenderContent);
  }, [onRenderContent, setHeaderRenderer, setContentRenderer, onRenderHeader]);

  const openPane = useCallback((): void => {
    updateRenderers();
    setActiveSidePaneId(() => sidePaneId);
  }, [setActiveSidePaneId, sidePaneId, updateRenderers]);

  useEffect(() => {
    if (isOpen) {
      updateRenderers();
    }
  }, [isOpen, updateRenderers]);

  return { isOpen, openPane };
};

/** @private */
export const useCloseSidePane = (): {
  closePane: () => void;
} => {
  const { setActiveSidePaneId, setHeaderRenderer, setContentRenderer } = useSidePaneContext();

  const closePane = useCallback((): void => {
    setActiveSidePaneId(undefined);
    setHeaderRenderer(undefined);
    setContentRenderer(undefined);
  }, [setContentRenderer, setHeaderRenderer, setActiveSidePaneId]);

  return { closePane };
};
