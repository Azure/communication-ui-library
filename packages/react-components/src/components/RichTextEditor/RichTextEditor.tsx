// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { richTextEditorWrapperStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { useTheme } from '../../theming';
import { RichTextStrings } from './RichTextSendBox';
import { isDarkThemed } from '../../theming/themeUtils';
import CopyPastePlugin from './Plugins/CopyPastePlugin';
import type {
  ContentModelDocument,
  ContentModelParagraph,
  EditorPlugin,
  IEditor,
  ReadonlyContentModelBlockGroup,
  ShallowMutableContentModelDocument,
  KnownAnnounceStrings
} from 'roosterjs-content-model-types';
import { createModelFromHtml, Editor, exportContent } from 'roosterjs-content-model-core';
import {
  createBr,
  createEmptyModel,
  createParagraph,
  createSelectionMarker,
  setSelection
} from 'roosterjs-content-model-dom';
import { KeyboardInputPlugin } from './Plugins/KeyboardInputPlugin';
import {
  AutoFormatPlugin,
  EditPlugin,
  PastePlugin,
  ShortcutPlugin,
  DefaultSanitizers
} from 'roosterjs-content-model-plugins';
import { UpdateContentPlugin, UpdateEvent } from './Plugins/UpdateContentPlugin';
import { RichTextToolbar } from './Toolbar/RichTextToolbar';
import { RichTextToolbarPlugin } from './Plugins/RichTextToolbarPlugin';
import { ContextMenuPlugin } from './Plugins/ContextMenuPlugin';
import { TableEditContextMenuProvider } from './Plugins/TableEditContextMenuProvider';
import { borderApplier, dataSetApplier } from '../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  getPreviousInlineImages,
  getRemovedInlineImages,
  removeLocalBlobs,
  cleanAllLocalBlobs
} from '../utils/RichTextEditorUtils';
import { ContextualMenu, IContextualMenuItem, IContextualMenuProps, Theme } from '@fluentui/react';
import { PlaceholderPlugin } from './Plugins/PlaceholderPlugin';
import { getFormatState, setDirection } from 'roosterjs-content-model-api';
import UndoRedoPlugin from './Plugins/UndoRedoPlugin';

/**
 * Style props for {@link RichTextEditor}.
 *
 * @private
 */
export interface RichTextEditorStyleProps {
  minHeight: string;
  maxHeight: string;
}

/**
 * Props for {@link RichTextEditor}.
 *
 * @private
 */
export interface RichTextEditorProps {
  // the initial content of editor that is set when editor is created (e.g. when editing a message)
  initialContent?: string;
  onChange: (
    newValue?: string,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ removedInlineImages?: Record<string, string>[]
  ) => void;
  onKeyDown?: (ev: KeyboardEvent) => void;
  // update the current content of the rich text editor
  onContentModelUpdate?: (contentModel: ContentModelDocument | undefined) => void;
  contentModel?: ContentModelDocument | undefined;
  placeholderText?: string;
  strings: Partial<RichTextStrings>;
  showRichTextEditorFormatting: boolean;
  styles: RichTextEditorStyleProps;
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;
}

/**
 * Represents a reference to the RichTextEditor component.
 */
export interface RichTextEditorComponentRef {
  /**
   * Sets focus on the RichTextEditor component.
   */
  focus: () => void;

  /**
   * Sets the content of the RichTextEditor component to an empty string.
   */
  setEmptyContent: () => void;

  /**
   * Retrieves the plain text content of the RichTextEditor component.
   * @returns The plain text content of the RichTextEditor component, or undefined if the editor isn't available.
   */
  getPlainContent: () => string | undefined;
}

/**
 * A component to wrap RoosterJS Rich Text Editor.
 *
 * @beta
 */
export const RichTextEditor = React.forwardRef<RichTextEditorComponentRef, RichTextEditorProps>((props, ref) => {
  const {
    initialContent,
    onChange,
    placeholderText,
    strings,
    showRichTextEditorFormatting,
    autoFocus,
    onKeyDown,
    onContentModelUpdate,
    contentModel,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onPaste,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onInsertInlineImage
  } = props;
  const editor = useRef<IEditor | null>(null);
  const editorDiv = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [contextMenuProps, setContextMenuProps] = useState<IContextualMenuProps | null>(null);
  const previousThemeDirection = useRef(themeDirection(theme));
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  // This will be set when the editor is initialized and when the content is updated.
  const [previousInlineImages, setPreviousInlineImages] = useState<Record<string, string>[]>([]);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const [inlineImageLocalBlobs, setInlineImageLocalBlobs] = useState<Record<string, string>>({});

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  useEffect(() => {
    return () => {
      // Cleanup Local Blob URLs when the component is unmounted
      cleanAllLocalBlobs(inlineImageLocalBlobs);
    };
    // This effect should only run once when the component is unmounted, so we don't need to add any dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        if (editor.current) {
          editor.current.focus();
        }
      },
      setEmptyContent() {
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        setPreviousInlineImages([]);
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        cleanAllLocalBlobs(inlineImageLocalBlobs);

        if (editor.current) {
          // remove all content from the editor and update the model
          // ContentChanged event will be sent by RoosterJS automatically
          editor.current.formatContentModel((model: ShallowMutableContentModelDocument): boolean => {
            // Create a new empty paragraph with selection marker
            // this is needed for correct processing of images after the content is deleted
            const newModel = createEmptyModel();
            model.blocks = newModel.blocks;
            return true;
          });
          //reset content model
          onContentModelUpdate && onContentModelUpdate(editor.current.getContentModelCopy('disconnected'));
        }
      },
      getPlainContent() {
        if (editor.current) {
          return exportContent(editor.current, 'PlainTextFast');
        } else {
          return undefined;
        }
      }
    };
  }, [/* @conditional-compile-remove(rich-text-editor-image-upload) */ inlineImageLocalBlobs, onContentModelUpdate]);

  const toolbarPlugin = React.useMemo(() => {
    return new RichTextToolbarPlugin();
  }, []);

  const placeholderPlugin = useMemo(() => {
    const textColor = theme.palette?.neutralSecondary;
    return new PlaceholderPlugin(
      '',
      textColor
        ? {
            textColor: textColor
          }
        : undefined
    );
  }, [theme]);

  useEffect(() => {
    if (placeholderText !== undefined) {
      placeholderPlugin.updatePlaceholder(placeholderText);
    }
  }, [placeholderPlugin, placeholderText]);

  const toolbar = useMemo(() => {
    return <RichTextToolbar plugin={toolbarPlugin} strings={strings} />;
  }, [strings, toolbarPlugin]);

  const updatePlugin = useMemo(() => {
    return new UpdateContentPlugin();
  }, []);

  const copyPastePlugin = useMemo(() => {
    return new CopyPastePlugin();
  }, []);

  const onChangeContent = useCallback(
    (/* @conditional-compile-remove(rich-text-editor-image-upload) */ shouldUpdateInlineImages?: boolean) => {
      if (editor.current === null) {
        return;
      }
      const content = exportContent(editor.current);
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      let removedInlineImages: Record<string, string>[] = [];
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      if (shouldUpdateInlineImages) {
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        removedInlineImages = getRemovedInlineImages(content, previousInlineImages);
      }

      onChange &&
        onChange(content, /* @conditional-compile-remove(rich-text-editor-image-upload) */ removedInlineImages);

      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      setPreviousInlineImages(getPreviousInlineImages(content));
    },
    [onChange, /* @conditional-compile-remove(rich-text-editor-image-upload) */ previousInlineImages]
  );

  useEffect(() => {
    // don't set callback in plugin constructor to update callback without plugin recreation
    updatePlugin.onUpdate = (
      event: string,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ shouldRemoveInlineImages?: boolean
    ) => {
      if (editor.current === null) {
        return;
      }
      if (event === UpdateEvent.Blur || event === UpdateEvent.Dispose) {
        onContentModelUpdate && onContentModelUpdate(editor.current.getContentModelCopy('disconnected'));
      } else {
        const content = exportContent(editor.current);
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        let removedInlineImages: Record<string, string>[] = [];
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        if (shouldRemoveInlineImages) {
          removedInlineImages = getRemovedInlineImages(content, previousInlineImages);
          if (removedInlineImages.length > 0) {
            removeLocalBlobs(inlineImageLocalBlobs, removedInlineImages);
          }
        }

        onChange &&
          onChange(content, /* @conditional-compile-remove(rich-text-editor-image-upload) */ removedInlineImages);

        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        setPreviousInlineImages(getPreviousInlineImages(content));
      }
    };
  }, [
    onChange,
    onContentModelUpdate,
    updatePlugin,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ previousInlineImages,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ inlineImageLocalBlobs
  ]);

  const undoRedoPlugin = useMemo(() => {
    return new UndoRedoPlugin();
  }, []);

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  useEffect(() => {
    if (onInsertInlineImage) {
      copyPastePlugin.onInsertInlineImage = (imageAttributes: Record<string, string>) => {
        const { id, src } = imageAttributes;
        setInlineImageLocalBlobs((prev) => {
          if (!id || !src) {
            return prev;
          }
          return { ...prev, [id]: src };
        });
        onInsertInlineImage(imageAttributes);
      };
    } else {
      copyPastePlugin.onInsertInlineImage = undefined;
    }
    undoRedoPlugin.onInsertInlineImage = onInsertInlineImage;
  }, [copyPastePlugin, onInsertInlineImage, undoRedoPlugin]);

  useEffect(() => {
    undoRedoPlugin.onUpdateContent = () => {
      onChangeContent(/* @conditional-compile-remove(rich-text-editor-image-upload) */ true);
    };
  }, [onChangeContent, undoRedoPlugin]);

  const keyboardInputPlugin = useMemo(() => {
    return new KeyboardInputPlugin();
  }, []);

  useEffect(() => {
    // don't set callback in plugin constructor to update callback without plugin recreation
    keyboardInputPlugin.onKeyDown = onKeyDown;
  }, [keyboardInputPlugin, onKeyDown]);

  const tableContextMenuPlugin = useMemo(() => {
    return new TableEditContextMenuProvider();
  }, []);

  useEffect(() => {
    tableContextMenuPlugin.updateStrings(strings);
  }, [tableContextMenuPlugin, strings]);

  const onContextMenuRender = useCallback(
    (container: HTMLElement, items: IContextualMenuItem[], onDismiss: () => void): void => {
      setContextMenuProps({
        items: items,
        target: container,
        onDismiss: onDismiss
      });
    },
    []
  );

  const onContextMenuDismiss = useCallback((): void => {
    setContextMenuProps(null);
  }, []);

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  useEffect(() => {
    copyPastePlugin.onPaste = onPaste;
  }, [copyPastePlugin, onPaste]);

  const plugins: EditorPlugin[] = useMemo(() => {
    const contentEdit = new EditPlugin({ handleTabKey: false });
    // AutoFormatPlugin previously was a part of the edit plugin
    const autoFormatPlugin = new AutoFormatPlugin({ autoBullet: true, autoNumbering: true, autoLink: true });
    const roosterPastePlugin = new PastePlugin(false, {
      additionalDisallowedTags: ['head', '!doctype', '!cdata', '#comment'],
      additionalAllowedTags: [],
      styleSanitizers: DefaultSanitizers,
      attributeSanitizers: {}
    });

    const shortcutPlugin = new ShortcutPlugin();
    const contextMenuPlugin = new ContextMenuPlugin(onContextMenuRender, onContextMenuDismiss);
    return [
      placeholderPlugin,
      keyboardInputPlugin,
      contentEdit,
      autoFormatPlugin,
      updatePlugin,
      copyPastePlugin,
      roosterPastePlugin,
      toolbarPlugin,
      shortcutPlugin,
      // contextPlugin and tableEditMenuProvider allow to show insert/delete menu for the table
      contextMenuPlugin,
      tableContextMenuPlugin,
      undoRedoPlugin
    ];
  }, [
    onContextMenuRender,
    onContextMenuDismiss,
    placeholderPlugin,
    keyboardInputPlugin,
    updatePlugin,
    copyPastePlugin,
    toolbarPlugin,
    tableContextMenuPlugin,
    undoRedoPlugin
  ]);

  const announcerStringGetter = useCallback(
    (key: KnownAnnounceStrings): string => {
      switch (key) {
        case 'announceListItemBullet':
          return strings.richTextNewBulletedListItemAnnouncement ?? '';
        case 'announceListItemNumbering':
          return strings.richTextNewNumberedListItemAnnouncement ?? '';
        case 'announceOnFocusLastCell':
          return '';
      }
    },
    [strings.richTextNewBulletedListItemAnnouncement, strings.richTextNewNumberedListItemAnnouncement]
  );

  useEffect(() => {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    const prevInlineImage = getPreviousInlineImages(initialContent);
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    setPreviousInlineImages(prevInlineImage);

    const initialModel = createEditorInitialModel(initialContent, contentModel);
    if (editorDiv.current) {
      editor.current = new Editor(editorDiv.current, {
        inDarkMode: isDarkThemed(theme),
        // doNotAdjustEditorColor is used to disable default color and background color for Rooster component
        doNotAdjustEditorColor: true,
        imageSelectionBorderColor: theme.palette.themePrimary,
        tableCellSelectionBackgroundColor: theme.palette.neutralLight,
        plugins: plugins,
        initialModel: initialModel,
        defaultModelToDomOptions: {
          formatApplierOverride: {
            // apply border and dataset formats for table
            border: borderApplier,
            dataset: dataSetApplier
          }
        },
        announcerStringGetter: announcerStringGetter
      });
    }

    if (autoFocus === 'sendBoxTextField') {
      editor.current?.focus();
    }

    return () => {
      if (editor.current) {
        editor.current.dispose();
        editor.current = null;
      }
    };
    // don't update the editor on deps update as everything is handled in separate hooks or plugins
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, plugins, announcerStringGetter]);

  useEffect(() => {
    const themeDirectionValue = themeDirection(theme);
    // check that editor exists and theme was actually changed
    // as format.direction will be undefined if setDirection is not called
    if (editor.current && previousThemeDirection.current !== themeDirectionValue) {
      const format = getFormatState(editor.current);
      if (format.direction !== themeDirectionValue) {
        // should be set after the hook where editor is created as the editor might be null
        // setDirection will cause the focus change back to the editor and this might not be what we want to do (autoFocus prop)
        // that's why it's not part of the create editor hook
        setDirection(editor.current, theme.rtl ? 'rtl' : 'ltr');
      }
      previousThemeDirection.current = themeDirectionValue;
    }
  }, [theme]);

  return (
    <div data-testid={'rich-text-editor-wrapper'}>
      {showRichTextEditorFormatting && toolbar}
      <div className={richTextEditorWrapperStyle(theme)}>
        {/* div that is used by Rooster JS as a parent of the editor */}
        <div
          id="richTextSendBox"
          ref={editorDiv}
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          data-testid={'rooster-rich-text-editor'}
          className={richTextEditorStyle(props.styles)}
          aria-label={placeholderText}
        />
      </div>
      {contextMenuProps && <ContextualMenu {...contextMenuProps} calloutProps={{ isBeakVisible: false }} />}
    </div>
  );
});

const createEditorInitialModel = (
  initialContent?: string,
  contentModel?: ContentModelDocument
): ContentModelDocument | undefined => {
  if (contentModel) {
    // contentModel is the current content of the editor
    return contentModel;
  } else {
    const initialContentValue = initialContent;
    const initialModel =
      initialContentValue && initialContentValue.length > 0 ? createModelFromHtml(initialContentValue) : undefined;
    if (initialModel && initialModel.blocks.length > 0) {
      // lastBlock should have blockType = paragraph, otherwise add a new paragraph
      // to set focus to the end of the content
      const lastBlock = initialModel.blocks[initialModel.blocks.length - 1];
      if (lastBlock?.blockType === 'Paragraph') {
        // now lastBlock is paragraph
        setSelectionAfterLastSegment(initialModel, lastBlock);
      } else {
        const block = createParagraph(false);
        initialModel.blocks.push(block);
        setSelectionAfterLastSegment(initialModel, block);
        // add content to the paragraph, otherwise height might be calculated incorrectly
        block.segments.push(createBr());
      }
    }
    return initialModel;
  }
};

const setSelectionAfterLastSegment = (model: ReadonlyContentModelBlockGroup, block: ContentModelParagraph): void => {
  //selection marker should have the same format as the last segment if any
  const format = block.segments.length > 0 ? block.segments[block.segments.length - 1]?.format : undefined;
  const marker = createSelectionMarker(format);
  block.segments.push(marker);
  setSelection(model, marker);
};

const themeDirection = (theme: Theme): 'rtl' | 'ltr' => {
  return theme.rtl ? 'rtl' : 'ltr';
};
