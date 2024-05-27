// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ContextMenuPluginBase } from 'roosterjs-content-model-plugins';
import type { IContextualMenuItem } from '@fluentui/react/';

/**
 * Represents a plugin that adds a context menu to the rich text editor.
 */
export class ContextMenuPlugin extends ContextMenuPluginBase<IContextualMenuItem> {
  constructor(
    onRender: (container: HTMLElement, items: IContextualMenuItem[], onDismiss: () => void) => void,
    onDismiss: () => void
  ) {
    super({
      /**
       * Renders the context menu in the specified container with the provided items.
       * @param container - The container element where the context menu should be rendered.
       * @param items - The items to be displayed in the context menu.
       * @param onDismiss - Callback function to be called when the context menu is dismissed. It will call `dismiss` method.
       */
      render: (container, items, onDismissCallback) => {
        const filteredItems = items.filter((item): item is IContextualMenuItem => item !== null);
        onRender(container, filteredItems, onDismissCallback);
      },
      /**
       * Dismisses the context menu.
       */
      dismiss: () => {
        onDismiss();
      }
    });
  }
}
