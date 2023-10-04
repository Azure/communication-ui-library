// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { PickerPlugin } from 'roosterjs-editor-plugins';
import { PickerPluginOptions } from 'roosterjs-editor-types';
import { ReactEditorPlugin, UIUtilities } from 'roosterjs-react';
import { MentionPluginDataProvider } from '../DataProvider/MentionPluginDataProvider';
import { Mention, MentionLookupOptions, _MentionPopover, _MentionPopoverProps } from '../../MentionPopover';
import { renderReactComponent } from '../PluginUI/PluginUI';

/**
 * @private
 */
export interface MentionPluginProps extends MentionLookupOptions {
  /**
   * Element to anchor the popover to.
   */
  target: React.RefObject<Element>;
}

/**
 * @private
 */
export interface RenderMentionPluginUIProps {
  /**
   * Array of mention suggestions used to populate the suggestion list
   */
  suggestions: Mention[];
  /**
   * Index of the currently focused suggestion, if any
   */
  activeSuggestionIndex?: number;
  /**
   * When rendering the popover, where to position it relative to the target.
   */
  cursorPoint?: {
    x: number;
    y: number;
  };
  /**
   * Callback called when a mention suggestion is selected.
   */
  onSuggestionSelected: (suggestion: Mention) => void;
  /**
   * Callback to invoke when the popover is dismissed
   */
  onDismiss?: () => void;
}

/**
 * @private
 */
export default class MentionPlugin extends PickerPlugin implements ReactEditorPlugin {
  private uiUtilities: UIUtilities | undefined = undefined;
  private disposer: (() => void) | undefined = undefined;

  constructor(props: MentionPluginProps) {
    const onRenderPluginUICallback = (renderPluginUIProps: RenderMentionPluginUIProps): void => {
      const { suggestions, activeSuggestionIndex, cursorPoint, onSuggestionSelected, onDismiss } = renderPluginUIProps;
      const targetPositionOffset = { left: cursorPoint?.x ?? 0, top: cursorPoint?.y ?? 0 };
      if (suggestions.length > 0) {
        this.disposer = renderReactComponent(
          this.uiUtilities,
          <_MentionPopover
            suggestions={suggestions}
            activeSuggestionIndex={activeSuggestionIndex}
            target={props.target}
            targetPositionOffset={targetPositionOffset}
            onRenderSuggestionItem={props.onRenderSuggestionItem}
            onSuggestionSelected={onSuggestionSelected}
            onDismiss={() => {
              onDismissCallback();
              onDismiss && onDismiss();
            }}
          />
        );
      }
    };
    const onDismissCallback = (): void => {
      this.disposer?.();
      this.disposer = undefined;
    };

    const provider = new MentionPluginDataProvider({
      ...props,
      onRenderPluginUI: onRenderPluginUICallback,
      onPluginUIDismiss: onDismissCallback
    });
    const options: PickerPluginOptions = {
      //   elementIdPrefix: MentionsPickerConstants.AT_MENTION_ELEMENT_ID_PREFIX,
      //   changeSource: MentionsPickerConstants.AT_MENTION_CHANGE_SOURCE,
      //   triggerCharacter: MentionsPickerConstants.AT_MENTION_TRIGGER_CHARACTER,
      //   suggestionsLabel: PICKER_SUGGESTIONS_ID,
      //   suggestionLabelPrefix: PICKER_SUGGESTION_LABEL_PREFIX
      elementIdPrefix: 'msft-mention',
      changeSource: 'AtMention',
      triggerCharacter: props.trigger ?? '@'
    };

    super(provider, options);
  }

  public getName(): string {
    return 'MentionPlugin';
  }

  public setUIUtilities(uiUtilities: UIUtilities): void {
    this.uiUtilities = uiUtilities;
  }

  public getUiUtilities(): UIUtilities | undefined {
    return this.uiUtilities;
  }
}
