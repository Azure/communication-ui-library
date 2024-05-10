// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { ContextMenuProvider, IEditor } from 'roosterjs-content-model-types';
import { RichTextSendBoxStrings } from '../RichTextSendBox';
import { IContextualMenuItem } from '@fluentui/react';
import { getTableEditContextMenuItems } from '../../utils/RichTextTableUtils';

/**
 * Provides a context menu for editing tables in the rich text editor.
 */
export class TableEditContextMenuProvider implements ContextMenuProvider<IContextualMenuItem> {
  private editor: IEditor | null = null;
  strings: Partial<RichTextSendBoxStrings> = {};
  private items: IContextualMenuItem[] | null = null;

  updateStrings(strings: Partial<RichTextSendBoxStrings>): void {
    this.strings = strings;
    if (this.editor) {
      this.items = getTableEditContextMenuItems(this.editor, this.strings);
    }
  }

  getName(): string {
    return 'TableEditContextMenuProvider';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
    this.items = getTableEditContextMenuItems(editor, this.strings);
  }

  /**
   * Dispose this plugin
   */
  dispose(): void {
    this.editor = null;
  }

  getContextMenuItems(): IContextualMenuItem[] | null {
    return this.items;
  }
}
