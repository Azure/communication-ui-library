// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ContextMenuPluginBase } from 'roosterjs-content-model-plugins';
import { ContextualMenu, WindowProvider } from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react/';
import { FluentThemeProvider } from '../../../theming';

/**
 * Represents a plugin that adds a context menu to the rich text editor.
 */
export class ContextMenuPlugin extends ContextMenuPluginBase<IContextualMenuItem> {
  private disposer: (() => void) | null = null;

  constructor() {
    super({
      /**
       * Renders the context menu in the specified container with the provided items.
       * @param container - The container element where the context menu should be rendered.
       * @param items - The items to be displayed in the context menu.
       * @param onDismiss - Callback function to be called when the context menu is dismissed.
       */
      render: (container, items, onDismiss) => {
        const filteredItems = items.filter((item): item is IContextualMenuItem => item !== null);
        if (filteredItems.length > 0) {
          this.disposer = renderReactComponent(
            <ContextualMenu target={container} onDismiss={onDismiss} items={filteredItems} />,
            container
          );
        }
      },
      /**
       * Dismisses the context menu.
       * @param _ - Unused parameter.
       */
      dismiss: () => {
        this.disposer?.();
        this.disposer = null;
      }
    });
  }
}

const renderReactComponent = (reactElement: JSX.Element, container: HTMLElement): (() => void) => {
  const doc = container.ownerDocument;
  if (doc.defaultView !== null) {
    const root = createRoot(container!);
    root.render(
      <>
        <WindowProvider window={doc.defaultView}>
          <FluentThemeProvider>{reactElement}</FluentThemeProvider>
        </WindowProvider>
      </>
    );
    return () => {
      root.unmount();
    };
  }
  return () => {};
};
