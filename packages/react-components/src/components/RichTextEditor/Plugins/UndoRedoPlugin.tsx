// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import type { BeforeSetContentEvent } from 'roosterjs-content-model-types';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  PluginEventType,
  scrollToBottomRichTextEditor,
  getInsertedInlineImages
} from '../../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getInlineImageAttributes } from '../../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChangeSource } from 'roosterjs-content-model-dom';

/**
 * UndoRedoPlugin is a plugin for additional handling undo and redo events in the editor.
 */
export default class UndoRedoPlugin implements EditorPlugin {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  private editor: IEditor | null = null;
  // don't set value in constructor to be able to update it without plugin recreation
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;
  onUpdateContent?: (() => void) | null = null;

  getName(): string {
    return 'CustomUndoRedoPlugin';
  }

  initialize(editor: IEditor): void {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    this.editor = editor;
  }

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    // handle when new images are added to the editor because of undo/redo
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (this.editor && event.eventType === PluginEventType.BeforeSetContent && this.onInsertInlineImage) {
      handleBeforeSetEvent(event, this.editor, this.onInsertInlineImage);
    }

    // handle deleted images and updated content
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (
      this.onUpdateContent &&
      event.eventType === PluginEventType.ContentChanged &&
      event.source === ChangeSource.SetContent
    ) {
      this.onUpdateContent();
    }

    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (
      this.editor &&
      !this.editor.isDisposed() &&
      event.eventType === PluginEventType.ContentChanged &&
      event.source === ChangeSource.SetContent
    ) {
      // scroll the editor to the correct position after undo/redo actions
      scrollToBottomRichTextEditor();
    }
  }
}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const handleBeforeSetEvent = (
  event: BeforeSetContentEvent,
  editor: IEditor,
  onInsertInlineImage: (imageAttributes: Record<string, string>) => void
): void => {
  const currentImagesList = editor.getDocument().querySelectorAll('img');
  const insertedImages = getInsertedInlineImages(event.newContent, currentImagesList);

  insertedImages.forEach((image) => {
    const imageAttributes = getInlineImageAttributes(image);
    onInsertInlineImage(imageAttributes);
  });
};
