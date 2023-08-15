// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PickerDataProvider, PickerPluginOptions, IEditor, PluginEvent } from 'roosterjs-editor-types';
import { PickerPlugin } from 'roosterjs-editor-plugins';
import { MentionLookupOptions, _MentionPopover, Mention } from '../../MentionPopover';
import { ReactEditorPlugin, UIUtilities } from 'roosterjs-react';
import React from 'react';

import {
  TagData,
  findMentionTagForSelection,
  findNewSelectionIndexForMention,
  findStringsDiffIndexes,
  getDisplayNameForMentionSuggestion,
  getValidatedIndexInRange,
  htmlStringForMentionSuggestion,
  textToTagParser,
  updateHTML,
  MSFT_MENTION_TAG
} from '../../TextFieldWithMention/mentionTagUtils';

import { Caret } from 'textarea-caret-ts';

// Removed import of useLocale from '../../../localization';

export default class AtMentionPlugin implements ReactEditorPlugin {
  private DEFAULT_MENTION_TRIGGER = '@';
  private uiUtilities: UIUtilities | null = null;
  private iEditor: IEditor | null = null;
  private insertElementIntoEditor?: (elementToInsert: HTMLElement) => void;
  private setSuggestedTextCursorLocation?: { x: number; y: number };
  private setIsSuggestingShowPicker?: (isSuggesting: boolean) => void;
  private mentionSuggestions: Mention[] = [];
  private activeSuggestionIndex: number | undefined = undefined;
  // Removed useLocale() and replaced with a placeholder. You might want to pass this as a prop
  private localeStrings = {
    /* your default strings or props.localeStrings */
  };
  private caretPosition: Caret.Position | undefined = undefined;
  private mentionLookupOptions?: MentionLookupOptions = undefined;

  constructor(mentionLookupOptions?: MentionLookupOptions) {
    this.mentionLookupOptions = mentionLookupOptions;
  }
  getName() {
    return 'AtMentionPlugin';
  }
  initialize(editor: IEditor) {
    this.iEditor = editor;
  }
  dispose() {
    this.uiUtilities = null;
    this.iEditor = null;
  }

  //   willHandleEventExclusively?: ((event: PluginEvent) => boolean) | undefined;
  //   onPluginEvent?: ((event: PluginEvent) => void) | undefined;

  setUIUtilities(uiUtilities: UIUtilities): void {
    this.uiUtilities = uiUtilities;
  }

  getPickerDataProvider = (): PickerDataProvider => {
    return {
      onInitalize: (
        insertNodeCallback: (nodeToInsert: HTMLElement) => void,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor: IEditor
      ): void => {
        this.insertElementIntoEditor = insertNodeCallback;
        this.setIsSuggestingShowPicker = setIsSuggestingCallback;
        this.iEditor = editor;
      },
      onDispose: (): void => {},

      onIsSuggestingChanged: (isSuggesting: boolean): void => {},

      queryStringUpdated: (queryString: string, _isExactMatch: boolean): void => {
        this.debouncedQueryUpdate(queryString);
        console.log('queryStringUpdated::: ', queryString);
      },

      setCursorPoint: (point: { x: number; y: number }): void => {
        this.setSuggestedTextCursorLocation = point;
        console.log('setCursorPoint::: ', point);
      },

      onRemove: (_nodeRemoved: Node, _isBackwards: boolean): Node => document.createTextNode('')
    };
  };

  getPickerOption = (): PickerPluginOptions => {
    return {
      elementIdPrefix: 'msft-mention',
      changeSource: 'AtMention',
      triggerCharacter: '@'
    };
  };
  Picker: PickerPlugin = new PickerPlugin(this.getPickerDataProvider(), this.getPickerOption());

  debouncedQueryUpdate = async (query: string) => {
    let suggestions = (await this.mentionLookupOptions?.onQueryUpdated(query)) ?? [];
    suggestions = suggestions.filter((suggestion) => suggestion.displayText.trim() !== '');

    this.updateMentionSuggestions(suggestions);
  };

  onSuggestionSelected = (suggestion: Mention) => {
    const idHTML = ' id="' + suggestion.id + '"';
    // Placeholder for locale strings
    const displayNamePlaceholder = this.localeStrings.participantItem?.displayNamePlaceholder;
    const displayText = suggestion.displayText !== '' ? suggestion.displayText : displayNamePlaceholder ?? '';
    let mention = document.createElement(MSFT_MENTION_TAG);
    mention.setAttribute('id', suggestion.id);
    mention.innerText = displayText;
  };

  updateMentionSuggestions(suggestions: Mention[]): void {
    this.mentionSuggestions = suggestions;
  }

  popoverComponent = () => {
    return (
      this.mentionSuggestions.length > 0 && (
        <_MentionPopover
          suggestions={this.mentionSuggestions}
          activeSuggestionIndex={this.activeSuggestionIndex}
          // TODO: Add the missing 'inputBoxRef' variable
          target={undefined}
          targetPositionOffset={this.caretPosition}
          onRenderSuggestionItem={this.mentionLookupOptions?.onRenderSuggestionItem}
          onSuggestionSelected={this.onSuggestionSelected}
          onDismiss={() => {
            this.mentionSuggestions = [];
          }}
        />
      )
    );
  };
}
