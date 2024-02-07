// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IEditor, PickerDataProvider } from 'roosterjs-editor-types';
import { Mention, _MentionPopover } from '../../MentionPopover';
import { MentionPluginProps, MentionPluginUIProps } from '../Plugins/MentionPlugin';
import _ from 'lodash';
import { Position } from '@fluentui/react';

// Note:
// setIsSuggesting is a satchel action for this data provider
// setIsSuggestingCallback is the callback method from the Picker Plugin.

/**
 * @private
 */
export interface MentionDataProviderProps extends MentionPluginProps {
  onRenderPluginUI: (props: MentionPluginUIProps) => void;
  onPluginUIDismiss: () => void;
}

/**
 * @private
 */
export interface MentionDataProviderState {
  isSuggesting: boolean;
  queryString?: string;
  suggestions: Mention[];
  cursorPoint: { x: number; y: number };
}

/**
 * @private
 */
export class MentionDataProvider implements PickerDataProvider {
  private _state: MentionDataProviderState;
  private insertMentionIntoEditor: ((element: HTMLElement) => void) | null = null;
  private setIsSuggestingCallback: ((isSuggesting: boolean) => void) | null = null;
  public editor: IEditor | undefined;
  private props: MentionDataProviderProps;
  private disposer: (() => void) | undefined = undefined;

  constructor(props: MentionDataProviderProps) {
    this._state = {
      isSuggesting: false,
      queryString: '',
      suggestions: [],
      cursorPoint: { x: 0, y: 0 }
    };
    this.props = props;
    console.log('Data provider constructor');
  }

  onInitalize(
    insertNodeCallback: (element: HTMLElement) => void,
    isSuggestingCallback: (isSuggesting: boolean) => void,
    editor?: IEditor
  ): void {
    this.insertMentionIntoEditor = insertNodeCallback;
    this.setIsSuggestingCallback = isSuggestingCallback;
    this.editor = editor;
  }

  onDispose() {
    this.editor = undefined;
    this.setIsSuggestingCallback = null;
    this.insertMentionIntoEditor = null;
  }

  onIsSuggestingChanged = (isSuggesting: boolean) => {
    this._state.isSuggesting = isSuggesting;
    console.log('onIsSuggestingChanged::: Leah', this._state.isSuggesting, isSuggesting);
  };

  queryStringUpdated = async (queryString: string): Promise<void> => {
    console.log('queryStringUpdated::: ', queryString);
    let suggestions = (await this.props?.onQueryUpdated(queryString)) ?? [];
    suggestions = suggestions.filter((suggestion) => suggestion.displayText.trim() !== '');
    console.log('queryStringUpdated::: suggestions', suggestions, 'state', this._state.suggestions);

    // Sometimes PickerPlugin calls queryStringUpdated with the same queryString twice. Compare the suggestions to avoid unnecessary rendering.
    // Check the length first to avoid calling isEqual.
    if (queryString == this._state.queryString && suggestions.length == this._state.suggestions.length && _.isEqual(suggestions, this._state.suggestions)) {
      return;
    }
    this._state.queryString = queryString;
    this._state.suggestions = suggestions;
    if (this._state.isSuggesting) {
      console.log('queryStringUpdated::: show popover', queryString);
      const { suggestions, cursorPoint } = this._state;
      this.props.onRenderPluginUI({
        suggestions: suggestions,
        activeSuggestionIndex: 0,
        cursorPoint: cursorPoint,
        onSuggestionSelected: this.onSuggestionSelected,
        onDismiss: this.onDismissMentionPopover
      });
    } else {
      this._state.suggestions = [];
    }
  };

  selectOption = () => {
    //   if (!this.viewState.isSearching && this.viewState.findResultSet.length == 0) {
    //     this.setIsSuggestingCallback?.(false);
    //   } else
    //   if (this.viewState.selectedRecipientIndex == this.viewState.findResultSet.length) {
    //     findReadWriteRecipient(this.viewState, this.viewState.queryString, true, this.getAllRecipients());
    //   } else {
    // setAccepted(this.viewState, true);
    // this.addRecipient();
    //   }
  };

  shiftHighlight = (isDown: boolean) => {
    //   shiftAtMentionsHighlight(this.viewState, isDown, this.editor?.getDocument());
  };

  onRemove = (nodeRemoved: Node, isBackspace: boolean) => {
    if (isBackspace && (nodeRemoved.textContent?.split(' ').length ?? 0) > 1) {
      return this.deleteLastSegment(nodeRemoved);
    }
    return undefined as unknown as Node;
  };

  setCursorPoint = (targetPoint: { x: number; y: number }, buffer: number) => {
    console.log('setCursorPoint::: ', targetPoint, buffer);
    this._state.cursorPoint = targetPoint;

    // setTargetPoint(this.viewState, targetPoint, buffer);
  };

  getSelectedIndex = (): number => {
    // return this.viewState?.selectedRecipientIndex || -1;
    return 0;
  };

  onScroll = () => {
    // if (this.viewState?.isSuggesting) {
    //   this.setIsSuggestingCallback?.(false);
    // }
  };

  onHighlightChanged = (activeDescendantId: string | null) => {
    this.editor?.setEditorDomAttribute('aria-activedescendant', activeDescendantId);
  };

  // getMentionPopoverElement = (): JSX.Element => {
  //   const suggestions = this._state.suggestions;
  //   const offset = { left: this._state.cursorPoint.x, top: this._state.cursorPoint.y };
  //   return suggestions.length > 0 ? (
  //     <_MentionPopover
  //       suggestions={suggestions}
  //       // activeSuggestionIndex={this.activeSuggestionIndex}
  //       target={this.props.target}
  //       targetPositionOffset={offset}
  //       onRenderSuggestionItem={this.props.onRenderSuggestionItem}
  //       onSuggestionSelected={this.onSuggestionSelected}
  //       onDismiss={() => {
  //         this._state.suggestions = [];
  //         // setSuggestions([]);
  //         // onDismiss();
  //       }}
  //     />
  //   ) : (
  //     <></>
  //   );
  // };

  onSuggestionSelected = (suggestion: Mention) => {
    const anchorElement = document.createElement('a');
    const atMentionId = 'msft-mention' + suggestion.id;
    const targetName = suggestion.displayText;
    anchorElement.id = atMentionId;
    anchorElement.innerText = '@' + targetName;
    // Href is needed here to fix the bug where all the characters after the mention are also highlighted
    anchorElement.href = '#';
    anchorElement.style.color = '#004578';

    // const mentionElement = this.props.onRenderMention && this.props.onRenderMention(anchorElement)

    this.insertMentionIntoEditor && this.insertMentionIntoEditor(anchorElement);
    // this.editor?.select(anchorElement, Position.After)
    this.onDismissMentionPopover();
  }


  // const style = this.props.mentionStyle;
  // const styleString = (
  //   Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')
  // );
  // anchorElement.style.cssText = styleString
  
  // this.insertMentionIntoEditor && this.insertMentionIntoEditor(anchorElement);
  // this.onDismissMentionPopover();
    
    // const mentionElement = this.props.onRenderMention && this.props.onRenderMention(anchorElement)

    // this.insertMentionIntoEditor && this.insertMentionIntoEditor(mentionElement || anchorElement);
    // this.onDismissMentionPopover();
  // };

  onDismissMentionPopover = (): void => {
    this._state.suggestions = [];
    this.props.onPluginUIDismiss();
  };

  private deleteLastSegment(node: Node) {
    const splitContents = node.textContent?.split(' ');
    splitContents?.pop();
    node.textContent = splitContents?.join(' ').trim() || '';
    return node;
  }
}
