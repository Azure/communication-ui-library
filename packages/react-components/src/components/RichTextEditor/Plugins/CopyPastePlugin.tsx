// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import {
  ContentChangedEventSource,
  PluginEventType,
  scrollToBottomRichTextEditor
} from '../../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getInlineImageAttributes } from '../../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { _base64ToBlob } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { removeImageTags } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { v1 as generateGUID } from 'uuid';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  // don't set value in constructor to be able to update it without plugin recreation
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;

  getName(): string {
    return 'CopyPastePlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    // If onInsertInlineImage is not provided, we should remove the image tags before calling the onPaste callback
    if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal' && !this.onInsertInlineImage) {
      removeImageTags({ content: event.fragment });
    }

    handleBeforePasteEvent(event, /* @conditional-compile-remove(rich-text-editor-image-upload) */ this.onPaste);

    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    // We should handle the onInsertInlineImage after the onPaste callback in case Contosos want to modify the image tags, especially the src attribute.
    if (this.onInsertInlineImage) {
      handleInlineImage(event, this.onInsertInlineImage);
    }

    if (this.editor !== null && !this.editor.isDisposed()) {
      // scroll the editor to the correct position after pasting content
      scrollToBottomAfterContentPaste(event);
    }
  }
}

/**
 * @internal
 * Exported only for unit testing
 */
export const handleBeforePasteEvent = (
  event: PluginEvent,
  /* @conditional-compile-remove(rich-text-editor-image-upload) */ onPaste?: (event: {
    content: DocumentFragment;
  }) => void
): void => {
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal') {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onPaste?.({ content: event.fragment });
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    return;
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 * Exported only for unit testing
 */
export const handleInlineImage = (
  event: PluginEvent,
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void
): void => {
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal' && onInsertInlineImage) {
    event.fragment.querySelectorAll('img').forEach((image) => {
      const clipboardImage = event.clipboardData.image;
      const fileName = clipboardImage?.name || clipboardImage?.type.replace('/', '.');
      // If the image src is an external url, call the onInsertInlineImage callback with the url.
      let imageUrl = image.src;
      if (image.src.startsWith('data:image/')) {
        const blobImage = _base64ToBlob(image.src);
        imageUrl = URL.createObjectURL(blobImage);
      }

      image.src = imageUrl;
      image.alt = image.alt || 'image';
      // Assign a unique id to the image element so Contosos can identify the image element.
      // We also use it internally such as in getRemovedInlineImages to compare images in the content with previous images
      image.id = generateGUID();
      image.dataset.imageFileName = fileName;

      const imageAttributes = getInlineImageAttributes(image);

      onInsertInlineImage(imageAttributes);
    });
  }
};

/**
 * Update the scroll position of the editor after pasting content to ensure the content is visible.
 * @param event - The plugin event.
 */
export const scrollToBottomAfterContentPaste = (event: PluginEvent): void => {
  if (event.eventType === PluginEventType.ContentChanged && event.source === ContentChangedEventSource.Paste) {
    scrollToBottomRichTextEditor();
  }
};
