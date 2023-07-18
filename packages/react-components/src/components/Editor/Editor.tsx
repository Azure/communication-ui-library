import Editor from 'roosterjs-editor-core/lib/editor/Editor';
import EditorOptions from 'roosterjs-editor-core/lib/interfaces/EditorOptions';
import EditorPlugin from 'roosterjs-editor-core/lib/interfaces/EditorPlugin';
import EditorViewState from '../store/schema/EditorViewState';
import execCommand from 'roosterjs-editor-api/lib/utils/execCommand';
import HtmlSanitizer from 'roosterjs-editor-dom/lib/htmlSanitizer/HtmlSanitizer';
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import ViewStateManagePlugin from '../internalPlugins/ViewStateManagePlugin';
import { DocumentCommand } from 'roosterjs-editor-types';
import { PluginWithUI } from '../store/schema/MiniEditorPlugin';
import { setEditorAriaLabel } from '../utils/setEditorAriaLabel';
import { transformElementForDarkMode } from 'mini-darkmode-content-handler/lib/transformElementForDarkMode';
import { updateViewStateWithEditorContent } from '../actions/privateActions';
import { useTheme } from 'mini-theme/lib/contexts/ThemeContext';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';
import type { DefaultFormat } from 'roosterjs-editor-types';

/**
 * Props used by the RichTextEditor component
 */
export interface RichTextEditorProps {
  /**
   * EditorViewState to which the editor content has to be synced
   */
  viewState: EditorViewState;
  /** Optional: ScrollContainer to be passed to the Editor Options */
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  /**
   * Boolean specifying whether the viewState has to be updated on every keyPress in the Editor
   * This value will be passed down to ViewStateManagePlugin, which defaults to true.
   * Recommended to use default value (true) unless you don't want the viewState to update on every keypress
   * for some specific reason.
   * Currently if this value is false, the viewState is updated only when the Editor is disposed.
   */
  updateOnKeyPress?: boolean;
  /**
   * List of plugins to be initialized within the Editor
   */
  plugins?: EditorPlugin[];
  /**
   * Watermark text to be shown in editor
   */
  watermark?: string;
  /**
   * Formatting for watermark text
   */
  watermarkFormat?: DefaultFormat;
  /**
   * Function to execute when editor is focussed
   */
  onEditorFocus?: () => void;
}

/**
 * RichTextEditorHandle
 * Refs assigned to the RichTextEditor component should use this interface in their type definition
 * This interface defines the methods that are exposed to the ref.current object of the ref attached to RichTextEditor
 */
export interface RichTextEditorHandle {
  /** Gets the roosterjs Editor instance */
  getEditor: () => Editor;
  /**
   * Focus the cursor inside the editor
   */
  focus: (setCursorAtTheEnd?: boolean) => void;
  /**
   * If for some reason, you're forced to modify the content field in EditorViewState outside of mini-editor,
   * make sure that you call this function immediately after any such change.
   * Failing to call this function can cause your external modifications to be lost as soon as the user types into the editor.
   *
   * You should, of course, try your best to NEVER do this, but there are some scenarios (e.g upConvert) that currently do,
   * hence it's necessary to expose this via the handle.
   */
  syncEditorWithViewState: () => void;
  /**
   * Function which refreshes the content in the EditorViewState with DOM snapshot
   */
  syncViewStateWithEditorContent: () => void;
  /**
   * Get the current selection range where content will be inserted.
   * This is necessary for cases where editor might lose focus and will need to remember where
   * the last focus was (e.g InlineImage)
   * This replicates the selection range behavior from legacy compose so that this works across
   * all OS/Browsers.
   */
  getSelectionRange: () => Range;
  /**
   *
   * Undo the last change in the editor, if possible.
   * This also takes care of updating value in the EditorViewState
   */
  undo: () => void;
  /**
   * When called this method stops keyboard from coming up, even when user focuses on the Editor
   */
  hideKeyboard: () => void;
  /**
   * When called this method restores the default keyboard behavior, where keyboard comes up when user focuses on the Editor
   */
  showKeyboard: () => void;
  /**
   * This method creates a snapshot, for when user wants to undo changes made to the editor.
   * This should be used when editor might not be aware of the content changes that have been done,
   *  and you need to have an undo functionality.
   */
  createUndoSnapshot: () => void;
  /**
   * This method executes a backspace on Editor at the current selection.
   */
  executeBackspace: () => void;
  /**
   * This method inserts the HTML content at the current selection
   */
  insertHTMLContent: (content: string) => void;
}

const styles = require('./RichTextEditor.scss');
const EDITOR_DIV_ID = 'editorDiv';

/**
 * RichTextEditor for mini
 * This is a functional component that wraps the roosterjs Editor instance on the rendered div
 */
export const RichTextEditor = React.forwardRef(
  (props: RichTextEditorProps, ref?: React.RefObject<RichTextEditorHandle>): JSX.Element => {
    const editorDivRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor>(null);
    const latestSelectionRangeRef = useRef<Range>(null);
    const { viewState, plugins, onEditorFocus, scrollContainerRef, updateOnKeyPress, watermark, watermarkFormat } =
      props;
    const uiPlugins = plugins.filter(isUIPlugin) as PluginWithUI<any, any>[];
    const { isDarkTheme, palette } = useTheme();

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
      focus: (setCursorAtTheEnd: boolean = false) => {
        focusEditor(setCursorAtTheEnd);
      },
      syncEditorWithViewState: () => {
        /**
         * This will be called after upConvert, so we need to ensure
         * we convert any global css to inline, else formatting of scenarios
         * like @ mentions can break
         */
        const content = HtmlSanitizer.convertInlineCss(viewState.content);
        editorRef.current?.setContent(content);
      },
      syncViewStateWithEditorContent: () => {
        updateViewStateWithEditorContent(viewState, editorRef.current?.getContent(), false /*isInitializing*/);
      },
      getSelectionRange: () => latestSelectionRangeRef.current,
      undo: () => {
        editorRef.current?.canUndo() && editorRef.current?.undo();
      },
      hideKeyboard: () => {
        updateSelectionCallback();
        editorDivRef.current?.setAttribute('inputmode', 'none');
        editorDivRef.current?.blur();
      },
      showKeyboard: () => {
        editorDivRef.current?.removeAttribute('inputmode');
      },
      createUndoSnapshot: () => {
        editorRef.current?.addUndoSnapshot();
      },
      executeBackspace: () => {
        execCommand(editorRef.current, DocumentCommand.Delete);
      },
      insertHTMLContent: (content: string) => {
        editorRef.current.insertContent(content);
        updateSelectionCallback();
      }
    }));

    const updateSelectionCallback = () => {
      /**
       * This is avoidable, but we could not get this behavior to work reliably in iOS with getSelectionRange, saveSelectionRange
       * TODO: Task #102795
       * Understand why the save/restore selectionRange of roosterjs is not working for iOS inline image blur/focus scenario
       */
      const selection = editorRef.current?.getSelection();
      if (selection?.rangeCount) {
        latestSelectionRangeRef.current = selection.getRangeAt(0);
      }
    };

    const focusEditor = (setCursorAtTheEnd: boolean) => {
      if (setCursorAtTheEnd) {
        /**
         * Focussing the cursor at the end of the view state content in the editor
         */
        const lastDivChild = editorDivRef.current?.lastChild;
        const lastChildOfDiv = lastDivChild?.lastChild;
        let range = latestSelectionRangeRef.current;
        if (!range && window.getSelection()?.rangeCount > 0) {
          range = window.getSelection().getRangeAt(0);
        }

        if (lastChildOfDiv?.nodeType === Node.TEXT_NODE) {
          range?.setEndAfter(lastChildOfDiv);
        } else if (lastChildOfDiv?.nodeName === 'BR') {
          range?.setEndBefore(lastChildOfDiv);
        }
        range?.collapse();
        updateSelectionCallback();
      }

      /**
       * Calling the focus method of the roosterjs Editor object focuses the cursor
       * on the div but does not bring up the keyboard. Hence calling focus directly
       * on the div's ref.
       */
      editorDivRef.current?.focus();
    };

    const getEditorOptions = useCallback(
      (): EditorOptions => ({
        initialContent: HtmlSanitizer.convertInlineCss(viewState.content),
        scrollContainer: scrollContainerRef?.current ?? undefined,
        plugins: [
          ...(plugins || []),
          watermark && new Watermark(watermark, watermarkFormat),
          new ViewStateManagePlugin(viewState, updateOnKeyPress, updateSelectionCallback)
        ],
        /**
         * Inherit value will match font and color properties to the ones we give to the editor parent from css.
         * fontFamily: 'inherit' will make sure this content is shown in the respective endpoint's default font family
         * like Segoe UI in big OWA.
         */
        defaultFormat: {
          fontFamily: 'inherit',
          fontSize: 'inherit',
          textColor: 'inherit',
          backgroundColors: {
            /* Text background will be same as editor background for default scenario. */
            darkModeColor: 'transparent',
            lightModeColor: 'transparent'
          }
        },
        inDarkMode: isDarkTheme,
        darkModeOptions: {
          transformOnInitialize: true,
          onExternalContentTransform: (element) => transformElementForDarkMode(element, palette.surfacePrimaryElevated)
        }
      }),
      /**
       * Though viewState is added as dependencies, it's reference never change. Added for completeness.
       */
      [
        scrollContainerRef,
        isDarkTheme,
        palette.surfacePrimaryElevated,
        plugins,
        updateOnKeyPress,
        viewState,
        watermark,
        watermarkFormat
      ]
    );

    useEffect(() => {
      editorRef.current = new Editor(editorDivRef.current, getEditorOptions());
      setEditorAriaLabel(editorRef.current);

      return () => {
        editorRef.current.dispose();
        editorRef.current = null;
      };
    }, [getEditorOptions, viewState]);

    const onBlur = () => {
      updateSelectionCallback();
      updateViewStateWithEditorContent(viewState, editorRef.current.getContent());
    };

    const onFocus = () => {
      onEditorFocus?.();
    };

    return (
      <>
        <div
          id={EDITOR_DIV_ID}
          aria-multiline="true"
          role="textbox"
          ref={editorDivRef}
          contentEditable={true}
          className={styles.editor}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {uiPlugins.map((plugin, index) =>
          React.createElement(plugin.getUIComponentClass(), {
            key: index,
            ...plugin.getUIComponentProps()
          })
        )}
      </>
    );
  }
);

function isUIPlugin(plugin: EditorPlugin): plugin is PluginWithUI<any, any> {
  return plugin && !!(plugin as PluginWithUI<any, any>).getUIComponentClass;
}
