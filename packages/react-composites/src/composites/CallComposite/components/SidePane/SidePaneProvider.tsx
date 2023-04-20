// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

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
}

const defaultSidePaneProps: SidePaneProps = {
  setHeaderRenderer: () => () => <></>,
  setContentRenderer: () => () => <></>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setActiveSidePaneId: () => {},
  activeSidePaneId: undefined
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

  const providerProps = useMemo(
    () => ({
      headerRenderer,
      setHeaderRenderer,
      contentRenderer,
      setContentRenderer,
      activeSidePaneId,
      setActiveSidePaneId
    }),
    [headerRenderer, contentRenderer, activeSidePaneId]
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
  const { setHeaderRenderer, setContentRenderer, setActiveSidePaneId, activeSidePaneId } = useSidePaneContext();
  const isOpen = activeSidePaneId === sidePaneId;

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
