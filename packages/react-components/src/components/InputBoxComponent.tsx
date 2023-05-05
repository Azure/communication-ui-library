// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useRef } from 'react';
/* @conditional-compile-remove(mention) */
import { useEffect } from 'react';
/* @conditional-compile-remove(mention) */
import { ComponentStrings, useLocale } from '../localization';

import {
  Stack,
  TextField,
  mergeStyles,
  IStyle,
  ITextField,
  concatStyleSets,
  IconButton,
  TooltipHost,
  ICalloutContentStyles
} from '@fluentui/react';
import { BaseCustomStyles } from '../types';
import {
  inputBoxStyle,
  inputBoxWrapperStyle,
  inputButtonStyle,
  textFieldStyle,
  textContainerStyle,
  inlineButtonsContainerStyle,
  newLineButtonsContainerStyle,
  inputBoxNewLineSpaceAffordance,
  inputButtonTooltipStyle
} from './styles/InputBoxComponent.style';
/* @conditional-compile-remove(mention) */
import { Caret } from 'textarea-caret-ts';
import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions, _MentionPopover, Mention } from './MentionPopover';
/* @conditional-compile-remove(mention) */
import { debounce } from 'lodash-es';
/* @conditional-compile-remove(mention) */
const defaultMentionTrigger = '@';
/**
 * @private
 */
export interface InputBoxStylesProps extends BaseCustomStyles {
  /** Styles for the text field. */
  textField?: IStyle;

  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;

  /** Styles for customizing the container of the text field */
  textFieldContainer?: IStyle;
}

type InputBoxComponentProps = {
  children: ReactNode;
  /**
   * Inline child elements passed in. Setting to false will mean they are on a new line.
   */
  inlineChildren: boolean;
  'data-ui-id'?: string;
  id?: string;
  textValue: string; // This could be plain text or HTML.
  onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement> | null, newValue?: string | undefined) => void;
  textFieldRef?: React.RefObject<ITextField>;
  inputClassName?: string;
  placeholderText?: string;
  supportNewline?: boolean;
  maxLength: number;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnterKeyDown?: () => void;
  errorMessage?: string | React.ReactElement;
  disabled?: boolean;
  styles?: InputBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
};

/**
 * @private
 */
export const InputBoxComponent = (props: InputBoxComponentProps): JSX.Element => {
  const {
    styles,
    id,
    'data-ui-id': dataUiId,
    textValue,
    onChange,
    textFieldRef,
    placeholderText,
    onKeyDown,
    onEnterKeyDown,
    supportNewline,
    inputClassName,
    errorMessage,
    disabled,
    children,
    /* @conditional-compile-remove(mention) */
    mentionLookupOptions
  } = props;
  const inputBoxRef = useRef<HTMLDivElement>(null);

  /* @conditional-compile-remove(mention) */
  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<Mention[]>([]);
  /* @conditional-compile-remove(mention) */
  // Current suggestion list, provided by the callback
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | undefined>(undefined);

  /* @conditional-compile-remove(mention) */
  // Index of the current trigger character in the text field
  const [currentTriggerStartIndex, setCurrentTriggerStartIndex] = useState<number>(-1);
  /* @conditional-compile-remove(mention) */
  const [inputTextValue, setInputTextValue] = useState<string>('');
  /* @conditional-compile-remove(mention) */
  const [tagsValue, setTagsValue] = useState<TagData[]>([]);
  /* @conditional-compile-remove(mention) */
  const [selectionStartValue, setSelectionStartValue] = useState<number | null>(null);
  /* @conditional-compile-remove(mention) */
  const [selectionEndValue, setSelectionEndValue] = useState<number | null>(null);
  /* @conditional-compile-remove(mention) */
  const [shouldHandleOnMouseDownDuringSelect, setShouldHandleOnMouseDownDuringSelect] = useState<boolean>(true);

  /* @conditional-compile-remove(mention) */
  // Caret position in the text field
  const [caretPosition, setCaretPosition] = useState<Caret.Position | undefined>(undefined);
  /* @conditional-compile-remove(mention) */
  // Index of where the caret is in the text field
  const [caretIndex, setCaretIndex] = useState<number | null>(null);
  /* @conditional-compile-remove(mention) */
  const localeStrings = useLocale().strings;

  /* @conditional-compile-remove(mention) */
  const updateMentionSuggestions = useCallback(
    (suggestions: Mention[]) => {
      setMentionSuggestions(suggestions);
      textFieldRef?.current?.focus();
    },
    [textFieldRef]
  );

  /* @conditional-compile-remove(mention) */
  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = mentionLookupOptions?.trigger || defaultMentionTrigger;
    console.log('textValue <- html', textValue);
    const [tags, plainText] = textToTagParser(textValue, trigger);
    console.log('tags', tags);
    console.log('plainText', plainText);
    setInputTextValue(plainText);
    setTagsValue(tags);
    updateMentionSuggestions([]);
  }, [textValue, mentionLookupOptions?.trigger, updateMentionSuggestions]);

  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedTextFiledStyle = mergeStyles(
    inputBoxStyle,
    inputClassName,
    props.inlineChildren ? {} : inputBoxNewLineSpaceAffordance
  );

  const mergedTextContainerStyle = mergeStyles(textContainerStyle, styles?.textFieldContainer);
  const mergedTextFieldStyle = concatStyleSets(textFieldStyle, {
    fieldGroup: styles?.textField,
    errorMessage: styles?.systemMessage
  });

  /* @conditional-compile-remove(mention) */
  const onSuggestionSelected = useCallback(
    (suggestion: Mention) => {
      let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
      if (selectionEnd < 0) {
        selectionEnd = 0;
      } else if (selectionEnd > inputTextValue.length) {
        selectionEnd = inputTextValue.length;
      }
      const oldPlainText = inputTextValue;
      const mention = htmlStringForMentionSuggestion(suggestion, localeStrings);

      // update plain text with the mention html text
      const newPlainText =
        inputTextValue.substring(0, currentTriggerStartIndex) + mention + inputTextValue.substring(selectionEnd);
      const triggerText = mentionLookupOptions?.trigger ?? defaultMentionTrigger;
      // update html text with updated plain text
      const [updatedHTML] = updateHTML(
        textValue,
        oldPlainText,
        newPlainText,
        tagsValue,
        currentTriggerStartIndex,
        selectionEnd,
        mention,
        triggerText
      );
      const displayName = getDisplayNameForMentionSuggestion(suggestion, localeStrings);
      // Move the caret in the text field to the end of the mention plain text
      console.log('onSuggestionSelected', currentTriggerStartIndex, displayName.length, triggerText.length);
      setCaretIndex(currentTriggerStartIndex + displayName.length + triggerText.length);
      setCurrentTriggerStartIndex(-1);
      updateMentionSuggestions([]);
      setActiveSuggestionIndex(undefined);
      onChange && onChange(null, updatedHTML);
    },
    [
      textFieldRef,
      inputTextValue,
      currentTriggerStartIndex,
      mentionLookupOptions?.trigger,
      onChange,
      textValue,
      tagsValue,
      /* @conditional-compile-remove(mention) */
      updateMentionSuggestions,
      /* @conditional-compile-remove(mention) */
      localeStrings
    ]
  );

  const onTextFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Uses KeyCode 229 and which code 229 to determine if the press of the enter key is from a composition session or not (Safari only)
      if (ev.nativeEvent.isComposing || ev.nativeEvent.keyCode === 229 || ev.nativeEvent.which === 229) {
        return;
      }
      if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0) {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? mentionSuggestions.length - 1
              : Math.max(activeSuggestionIndex - 1, 0);
          setActiveSuggestionIndex(newActiveIndex);
        }
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0) {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? 0
              : Math.min(activeSuggestionIndex + 1, mentionSuggestions.length - 1);
          setActiveSuggestionIndex(newActiveIndex);
        }
      }
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();

        // If we are looking up a mention, select the focused suggestion
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0 && activeSuggestionIndex !== undefined) {
          const selectedMention = mentionSuggestions[activeSuggestionIndex];
          if (selectedMention) {
            onSuggestionSelected(selectedMention);
            return;
          }
        }

        onEnterKeyDown && onEnterKeyDown();
      }
      onKeyDown && onKeyDown(ev);
    },
    [
      onEnterKeyDown,
      onKeyDown,
      supportNewline,
      /* @conditional-compile-remove(mention) */
      mentionSuggestions,
      /* @conditional-compile-remove(mention) */
      activeSuggestionIndex,
      /* @conditional-compile-remove(mention) */
      onSuggestionSelected
    ]
  );

  /* @conditional-compile-remove(mention) */
  const debouncedQueryUpdate = useRef(
    debounce(async (query: string) => {
      const suggestions = (await mentionLookupOptions?.onQueryUpdated(query)) ?? [];
      if (suggestions.length === 0) {
        setActiveSuggestionIndex(undefined);
      } else if (activeSuggestionIndex === undefined) {
        setActiveSuggestionIndex(0);
      }
      updateMentionSuggestions(suggestions);
    }, 500)
  ).current;

  /* @conditional-compile-remove(mention) */
  useEffect(() => {
    return () => {
      debouncedQueryUpdate.cancel();
    };
  }, [debouncedQueryUpdate]);

  /* @conditional-compile-remove(mention) */
  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedValue?: string | undefined
  ): Promise<void> => {
    let newValue = updatedValue;
    if (newValue === undefined) {
      newValue = '';
    }
    const triggerText = mentionLookupOptions?.trigger ?? defaultMentionTrigger;

    const newTextLength = newValue.length;
    let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
    if (selectionEnd < 0) {
      selectionEnd = 0;
    } else if (selectionEnd > newTextLength) {
      selectionEnd = newTextLength - 1;
    }
    // If we are enabled for lookups,
    if (mentionLookupOptions !== undefined) {
      // Look at the range of the change for a trigger character
      const triggerPriorIndex = newValue?.lastIndexOf(triggerText, selectionEnd - 1);
      // Update the caret position, if not doing a lookup
      setCaretPosition(Caret.getRelativePosition(event.currentTarget));

      if (triggerPriorIndex !== undefined) {
        // trigger is found
        const isSpaceBeforeTrigger = newValue?.substring(triggerPriorIndex - 1, triggerPriorIndex) === ' ';
        const wordAtSelection = newValue?.substring(triggerPriorIndex, selectionEnd);
        let tagIndex = currentTriggerStartIndex;
        if (!isSpaceBeforeTrigger && triggerPriorIndex !== 0) {
          //no space before the trigger <- continuation of the previous word
          tagIndex = -1;
          setCurrentTriggerStartIndex(tagIndex);
        } else if (wordAtSelection === triggerText) {
          // start of the mention
          tagIndex = selectionEnd - triggerText.length;
          if (tagIndex < 0) {
            tagIndex = 0;
          }
          setCurrentTriggerStartIndex(tagIndex);
        }

        if (tagIndex === -1) {
          updateMentionSuggestions([]);
        } else {
          // In the middle of a @mention lookup
          if (tagIndex > -1) {
            const query = wordAtSelection.substring(triggerText.length, wordAtSelection.length);
            if (query !== undefined) {
              debouncedQueryUpdate(query);
            }
          }
        }
      }
    }
    let result = '';
    if (tagsValue.length === 0) {
      // no tags in the string, textValue is a sting
      result = newValue;
    } else {
      // there are tags in the text value, textValue is html string
      const { changeStart, oldChangeEnd, newChangeEnd } = findStringsDiffIndexes(
        inputTextValue,
        newValue,
        selectionEnd
      );
      // get updated html string
      const change = newValue.substring(changeStart, newChangeEnd);
      const [updatedHTML, updatedChangeNewEndIndex] = updateHTML(
        textValue,
        inputTextValue,
        newValue,
        tagsValue,
        changeStart,
        oldChangeEnd,
        change,
        triggerText
      );
      result = updatedHTML;
      if (updatedChangeNewEndIndex !== null) {
        if (
          (change.length === 1 && event.currentTarget.selectionStart === event.currentTarget.selectionEnd) || // simple input
          (change.length === 0 && newChangeEnd === changeStart) //delete
        ) {
          setCaretIndex(updatedChangeNewEndIndex);
        }
      }
    }

    onChange && onChange(event, result);
  };

  /* @conditional-compile-remove(mention) */
  const updateSelectionIndexesWithMentionIfNeeded = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    let updatedStartIndex = event.currentTarget.selectionStart;
    let updatedEndIndex = event.currentTarget.selectionEnd;
    if (
      event.currentTarget.selectionStart === event.currentTarget.selectionEnd &&
      event.currentTarget.selectionStart !== null &&
      event.currentTarget.selectionStart !== -1
    ) {
      const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionStart);
      if (
        mentionTag !== undefined &&
        mentionTag.plainTextBeginIndex !== undefined &&
        (event.currentTarget.selectionStart > mentionTag.plainTextBeginIndex ||
          (mentionTag.plainTextEndIndex !== undefined &&
            //TODO: check if -1 is needed
            event.currentTarget.selectionStart < mentionTag.plainTextEndIndex)) // - 1 because mentionTag.plainTextEndIndex is the next symbol after the mention
      ) {
        if (selectionStartValue === null) {
          updatedStartIndex = mentionTag.plainTextBeginIndex;
          updatedEndIndex = mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex;
        } else {
          const newSelectionIndex = findNewSelectionIndexForMention(
            mentionTag,
            inputTextValue,
            event.currentTarget.selectionStart,
            selectionStartValue
          );

          updatedStartIndex = newSelectionIndex;
          updatedEndIndex = newSelectionIndex;
        }
      }
    } else if (event.currentTarget.selectionStart !== event.currentTarget.selectionEnd) {
      // Both e.currentTarget.selectionStart !== selectionStartValue and e.currentTarget.selectionEnd !== selectionEndValue can be true when a user selects a text by double click
      if (event.currentTarget.selectionStart !== null && event.currentTarget.selectionStart !== selectionStartValue) {
        // the selection start is changed
        //TODO: is there another check should be here as in the previous if?
        const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionStart);
        if (mentionTag !== undefined && mentionTag.plainTextBeginIndex !== undefined) {
          //TODO: here it takes -1 when it shouldn't, update selectionstart and end with mouse move and or touch move
          updatedStartIndex = findNewSelectionIndexForMention(
            mentionTag,
            inputTextValue,
            event.currentTarget.selectionStart,
            selectionStartValue ?? -1
          );
        }
      }
      if (event.currentTarget.selectionEnd !== null && event.currentTarget.selectionEnd !== selectionEndValue) {
        // the selection end is changed
        const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionEnd);
        if (mentionTag !== undefined && mentionTag.plainTextBeginIndex !== undefined) {
          //TODO: here it takes -1 when it shouldn't, update selectionstart and end with mouse move and or touch move
          updatedEndIndex = findNewSelectionIndexForMention(
            mentionTag,
            inputTextValue,
            event.currentTarget.selectionEnd,
            selectionEndValue ?? -1
          );
        }
      }
    }
    // e.currentTarget.selectionDirection should be set to handle shift + arrow keys
    if (event.currentTarget.selectionDirection === null) {
      console.log('updateSelectionIndexesWithMentionIfNeeded, event.currentTarget.selectionDirection === null');
      event.currentTarget.setSelectionRange(updatedStartIndex, updatedEndIndex);
    } else {
      console.log('updateSelectionIndexesWithMentionIfNeeded, event.currentTarget.selectionDirection !== null');
      event.currentTarget.setSelectionRange(updatedStartIndex, updatedEndIndex, event.currentTarget.selectionDirection);
    }
    setSelectionStartValue(updatedStartIndex);
    setSelectionEndValue(updatedEndIndex);
  };

  const getInputFieldTextValue = (): string => {
    /* @conditional-compile-remove(mention) */
    return inputTextValue;
    return textValue;
  };

  return (
    <Stack className={mergedRootStyle}>
      <div className={mergedTextContainerStyle}>
        {
          /* @conditional-compile-remove(mention) */ mentionSuggestions.length > 0 && (
            <_MentionPopover
              suggestions={mentionSuggestions}
              activeSuggestionIndex={activeSuggestionIndex}
              target={inputBoxRef}
              targetPositionOffset={caretPosition}
              onRenderSuggestionItem={mentionLookupOptions?.onRenderSuggestionItem}
              onSuggestionSelected={onSuggestionSelected}
              onDismiss={() => {
                updateMentionSuggestions([]);
              }}
            />
          )
        }
        <TextField
          autoFocus={props.autoFocus === 'sendBoxTextField'}
          data-ui-id={dataUiId}
          multiline
          autoAdjustHeight
          multiple={false}
          resizable={false}
          componentRef={textFieldRef}
          id={id}
          inputClassName={mergedTextFiledStyle}
          placeholder={placeholderText}
          value={getInputFieldTextValue()}
          onChange={(e, newValue) => {
            /* @conditional-compile-remove(mention) */
            setInputTextValue(newValue ?? '');
            /* @conditional-compile-remove(mention) */
            handleOnChange(e, newValue);
            /* @conditional-compile-remove(mention) */
            return;
            onChange(e, newValue);
          }}
          /* @conditional-compile-remove(mention) */
          onSelect={(e) => {
            console.log(
              'onSelect',
              'caretIndex',
              caretIndex,
              'selectionStart',
              e.currentTarget.selectionStart,
              'selectionEnd',
              e.currentTarget.selectionEnd
            );
            if (caretIndex !== null) {
              let updatedCaretIndex = caretIndex;
              if (caretIndex >= inputTextValue.length) {
                //TODO: check if -1 is needed
                updatedCaretIndex = inputTextValue.length;
              } else if (caretIndex < 0) {
                updatedCaretIndex = 0;
              }
              if (e.currentTarget.selectionDirection !== null) {
                console.log('onSelect, event.currentTarget.selectionDirection !== null');
                e.currentTarget.setSelectionRange(
                  updatedCaretIndex,
                  updatedCaretIndex,
                  e.currentTarget.selectionDirection
                );
              } else {
                console.log('onSelect, event.currentTarget.selectionDirection === null');
                e.currentTarget.setSelectionRange(updatedCaretIndex, updatedCaretIndex);
              }
              setCaretIndex(null);
              return;
            }
            //TODO: need to check to navigate before/after space correctly in tag + when selecting by mouse
            /* @conditional-compile-remove(mention) */
            if (
              shouldHandleOnMouseDownDuringSelect &&
              e.currentTarget.selectionStart !== null &&
              e.currentTarget.selectionStart === e.currentTarget.selectionEnd
            ) {
              // handle mention click
              const mentionTag = findMentionTagForSelection(tagsValue, e.currentTarget.selectionStart);
              if (mentionTag !== undefined && mentionTag.plainTextBeginIndex !== undefined) {
                if (e.currentTarget.selectionDirection === null) {
                  console.log('onSelect, event.currentTarget.selectionDirection === null 2');
                  e.currentTarget.setSelectionRange(
                    mentionTag.plainTextBeginIndex,
                    mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex
                  );
                } else {
                  console.log('onSelect, event.currentTarget.selectionDirection !== null 2');
                  e.currentTarget.setSelectionRange(
                    mentionTag.plainTextBeginIndex,
                    mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex,
                    e.currentTarget.selectionDirection
                  );
                }
                setSelectionStartValue(mentionTag.plainTextBeginIndex);
                setSelectionEndValue(mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex);
              } else {
                setSelectionStartValue(e.currentTarget.selectionStart);
                setSelectionEndValue(e.currentTarget.selectionEnd);
              }
            } else {
              console.log('onSelect updateSelectionIndexesWithMentionIfNeeded');
              updateSelectionIndexesWithMentionIfNeeded(e);
            }
            /* @conditional-compile-remove(mention) */
            setShouldHandleOnMouseDownDuringSelect(false);
          }}
          // onMouseMove={(e) => {
          //   console.log('!!!!not equal onMouseMove');
          // should preventDefault be used?
          // for handling mouse actions
          /* @conditional-compile-remove(mention) */
          // console.log('updateHTML onMouseMove selectionStart', e.currentTarget.selectionStart);
          // console.log('updateHTML onMouseMove selectionEnd', e.currentTarget.selectionEnd);
          // console.log('updateHTML onMouseMove selectionDirection', e.currentTarget.selectionDirection);
          // if (e.currentTarget.selectionStart !== e.currentTarget.selectionEnd) {
          //   console.log('updateHTML onMouseMove e.currentTarget.selectionStart !== e.currentTarget.selectionEnd');
          // } else {
          //   console.log('updateHTML onMouseMove e.currentTarget.selectionStart === e.currentTarget.selectionEnd');
          // }
          // updateSelectionIndexesWithMentionIfNeeded(e);
          // e.currentTarget.setSelectionRange(
          //   e.currentTarget.selectionStart,
          //   e.currentTarget.selectionEnd,
          //   e.currentTarget.selectionDirection ?? 'none'
          // );
          // }}
          // onTouchMove={(e) => {
          //   //should be handled in the same way as mousemove
          //  }}
          onMouseDown={() => {
            // as events order is onMouseDown -> onSelect -> onClick
            // onClick and onMouseDown can't handle clicking on mention event because
            // onClick has wrong range as it's called after onSelect
            // onMouseDown doesn't have correct selectionRange yet
            // so we need to handle onMouseDown to prevent onSelect default behavior
            /* @conditional-compile-remove(mention) */
            setShouldHandleOnMouseDownDuringSelect(true);
          }}
          onTouchStart={() => {
            // see onMouseDown for more details
            /* @conditional-compile-remove(mention) */
            setShouldHandleOnMouseDownDuringSelect(true);
          }}
          autoComplete="off"
          onKeyDown={onTextFieldKeyDown}
          styles={mergedTextFieldStyle}
          disabled={disabled}
          errorMessage={errorMessage}
          elementRef={inputBoxRef}
        />
        <Stack
          horizontal
          className={mergeStyles(props.inlineChildren ? inlineButtonsContainerStyle : newLineButtonsContainerStyle)}
        >
          {children}
        </Stack>
      </div>
    </Stack>
  );
};

/**
 * Props for displaying a send button besides the text input area.
 *
 * @private
 */
export type InputBoxButtonProps = {
  onRenderIcon: (isHover: boolean) => JSX.Element;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
  tooltipContent?: string;
};

/**
 * @private
 */
export const InputBoxButton = (props: InputBoxButtonProps): JSX.Element => {
  const { onRenderIcon, onClick, ariaLabel, className, id, tooltipContent } = props;
  const [isHover, setIsHover] = useState(false);
  const mergedButtonStyle = mergeStyles(inputButtonStyle, className);

  const theme = useTheme();
  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  // Place callout with no gap between it and the button.
  const calloutProps = {
    gapSpace: 0,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };
  return (
    <TooltipHost hostClassName={inputButtonTooltipStyle} content={tooltipContent} calloutProps={{ ...calloutProps }}>
      <IconButton
        className={mergedButtonStyle}
        ariaLabel={ariaLabel}
        onClick={onClick}
        id={id}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        onRenderIcon={() => onRenderIcon(isHover)}
      />
    </TooltipHost>
  );
};

/* @conditional-compile-remove(mention) */
/**
 * Find mention tag if selection is inside of it
 *
 * @private
 */
const findMentionTagForSelection = (tags: TagData[], selection: number): TagData | undefined => {
  let mentionTag: TagData | undefined = undefined;
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    let plainTextEndIndex = 0;
    if (tag.plainTextEndIndex !== undefined && tag.closeTagIdx !== undefined) {
      // close tag exists
      plainTextEndIndex = tag.plainTextEndIndex;
    } else if (tag.plainTextBeginIndex !== undefined) {
      //no close tag
      plainTextEndIndex = tag.plainTextBeginIndex;
    }
    if (tag.subTags !== undefined && tag.subTags.length !== 0) {
      const selectedTag = findMentionTagForSelection(tag.subTags, selection);
      if (selectedTag !== undefined) {
        mentionTag = selectedTag;
        break;
      }
    } else if (
      tag.tagType === 'msft-mention' &&
      tag.plainTextBeginIndex !== undefined &&
      tag.plainTextBeginIndex < selection &&
      selection < plainTextEndIndex
    ) {
      mentionTag = tag;
      break;
    }
  }
  return mentionTag;
};

/* @conditional-compile-remove(mention) */
/**
 * Go through tags and find a new the selection index if it is inside of a mention tag
 *
 * @private
 */
const findNewSelectionIndexForMention = (
  tag: TagData,
  textValue: string,
  selection: number,
  previousSelection: number
): number => {
  if (
    tag.plainTextBeginIndex === undefined ||
    tag.tagType !== 'msft-mention' ||
    selection === previousSelection ||
    tag.plainTextEndIndex === undefined
  ) {
    return selection;
  }
  let spaceIndex = 0;
  if (selection <= previousSelection) {
    // the cursor is moved to the left
    spaceIndex = textValue.lastIndexOf(' ', selection ?? 0);
    if (spaceIndex === -1) {
      // no space before the selection
      spaceIndex = tag.plainTextBeginIndex;
    }
  } else {
    // the cursor is moved to the right
    spaceIndex = textValue.indexOf(' ', selection ?? 0);
    if (spaceIndex === -1) {
      // no space after the selection
      spaceIndex = tag.plainTextEndIndex ?? tag.plainTextBeginIndex;
    }
  }

  if (spaceIndex < tag.plainTextBeginIndex) {
    spaceIndex = tag.plainTextBeginIndex;
  } else if (spaceIndex > tag.plainTextEndIndex) {
    spaceIndex = tag.plainTextEndIndex;
  }
  return spaceIndex;
};

/* @conditional-compile-remove(mention) */
/**
 * Handle mention tag edit and by word deleting
 *
 * @private
 */
const handleMentionTagUpdate = (
  htmlText: string,
  oldPlainText: string,
  lastProcessedHTMLIndex: number,
  processedChange: string,
  tag: TagData,
  closeTagIdx: number,
  closeTagLength: number,
  plainTextEndIndex: number,
  startIndex: number,
  oldPlainTextEndIndex: number,
  mentionTagLength: number
): [resultValue: string, updatedChange: string, htmlIndex: number, plainTextSelectionEndIndex: number | null] => {
  if (tag.tagType !== 'msft-mention' || tag.plainTextBeginIndex === undefined) {
    return ['', processedChange, lastProcessedHTMLIndex, null];
  }
  let result = '';
  let plainTextSelectionEndIndex: number | null = null;
  let rangeStart: number;
  let rangeEnd: number;
  // check if space symbol is handled in case if string looks like '<1 2 3>'
  let isSpaceLengthHandled = false;
  rangeStart = oldPlainText.lastIndexOf(' ', startIndex);
  if (rangeStart !== -1 && rangeStart !== undefined && rangeStart > tag.plainTextBeginIndex) {
    isSpaceLengthHandled = true;
  }
  rangeEnd = oldPlainText.indexOf(' ', oldPlainTextEndIndex);
  if (rangeEnd === -1 || rangeEnd === undefined) {
    // check if space symbol is not found
    rangeEnd = plainTextEndIndex;
  } else if (!isSpaceLengthHandled) {
    // +1 to include the space symbol
    rangeEnd += 1;
  }
  isSpaceLengthHandled = true;

  if (rangeStart === -1 || rangeStart === undefined || rangeStart < tag.plainTextBeginIndex) {
    rangeStart = tag.plainTextBeginIndex;
  }
  if (rangeEnd > plainTextEndIndex) {
    rangeEnd = plainTextEndIndex;
  }

  if (rangeStart === tag.plainTextBeginIndex && rangeEnd === plainTextEndIndex) {
    // the whole tag should be removed
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
    plainTextSelectionEndIndex = tag.plainTextBeginIndex + processedChange.length;
    processedChange = '';
    lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
  } else {
    // only part of the tag should be removed
    let startChangeDiff = 0;
    let endChangeDiff = 0;
    // need to check only rangeStart > tag.plainTextBeginIndex as when rangeStart === tag.plainTextBeginIndex startChangeDiff = 0 and mentionTagLength shouldn't be subtracted
    if (rangeStart > tag.plainTextBeginIndex) {
      startChangeDiff = rangeStart - tag.plainTextBeginIndex - mentionTagLength;
    }
    endChangeDiff = rangeEnd - tag.plainTextBeginIndex - mentionTagLength;
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff);
    plainTextSelectionEndIndex = rangeStart + processedChange.length;
    lastProcessedHTMLIndex = tag.openTagIdx + tag.openTagBody.length + endChangeDiff;
    // processed change should not be changed as it should be added after the tag
  }
  return [result, processedChange, lastProcessedHTMLIndex, plainTextSelectionEndIndex];
};

/* @conditional-compile-remove(mention) */
/**
 * Go through the text and update it with the changed text
 *
 * @private
 */
const updateHTML = (
  htmlText: string,
  oldPlainText: string,
  newPlainText: string,
  tags: TagData[],
  startIndex: number,
  oldPlainTextEndIndex: number,
  change: string,
  mentionTrigger: string
): [string, number | null] => {
  let result = '';
  if (tags.length === 0) {
    // no tags added yet
    return [newPlainText, null];
  }
  if (startIndex === 0 && oldPlainTextEndIndex === oldPlainText.length) {
    // the whole text is changed
    return [newPlainText, null];
  }
  let lastProcessedHTMLIndex = 0;
  // the value can be updated with empty string when the change covers more than 1 place (tag + before or after the tag)
  // in this case change won't be added as part of the tag
  // e.g.: change is before and partially in tag => change will be added before the tag and outdated text in the tag will be removed
  // e.g.: change is after and partially in tag => change will be added after the tag and outdated text in the tag will be removed
  // e.g.: change is on the beginning of the tag => change will be added before the tag
  // e.g.: change is on the end of the tag => change will be added to the tag if it's not mention and after the tag if it's mention
  let processedChange = change;
  // end tag plain text index of the last processed tag
  let lastProcessedPlainTextTagEndIndex = 0;
  // as some tags/text can be removed fully, selectionEnd should be updated correctly
  let changeNewEndIndex: number | null = null;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.plainTextBeginIndex === undefined) {
      continue;
    }
    // all plain text indexes includes trigger length for the mention that shouldn't be included in
    // htmlText.substring because html strings don't include the trigger
    // mentionTagLength will be set only for 'msft-mention', otherwise should be 0
    let mentionTagLength = 0;
    let isMentionTag = false;
    if (tag.tagType === 'msft-mention') {
      mentionTagLength = mentionTrigger.length;
      isMentionTag = true;
    }

    // change start is before the open tag
    if (startIndex <= tag.plainTextBeginIndex) {
      // Math.max(lastProcessedPlainTextTagEndIndex, startIndex) is used as startIndex may not be in [[previous tag].plainTextEndIndex - tag.plainTextBeginIndex] range
      const startChangeDiff = tag.plainTextBeginIndex - Math.max(lastProcessedPlainTextTagEndIndex, startIndex);

      result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx - startChangeDiff) + processedChange;
      console.log('updateHTML 0 result after update', result);
      if (oldPlainTextEndIndex <= tag.plainTextBeginIndex) {
        // the whole change is before tag start
        // oldPlainTextEndIndex already includes mentionTag length
        const endChangeDiff = tag.plainTextBeginIndex - oldPlainTextEndIndex;
        lastProcessedHTMLIndex = tag.openTagIdx - endChangeDiff;
        processedChange = '';
        // the change is handled; exit
        break;
      } else {
        // change continues in the tag
        lastProcessedHTMLIndex = tag.openTagIdx;
        processedChange = '';
        // proceed to the next check
      }
    }
    let plainTextEndIndex = 0;
    let closeTagIdx = 0;
    let closeTagLength = 0;
    if (tag.plainTextEndIndex !== undefined && tag.closeTagIdx !== undefined) {
      // close tag exists
      plainTextEndIndex = tag.plainTextEndIndex;
      closeTagIdx = tag.closeTagIdx;
      // tag.tagType.length + </>
      closeTagLength = tag.tagType.length + 3;
    } else {
      // no close tag
      plainTextEndIndex = tag.plainTextBeginIndex;
      closeTagIdx = tag.openTagIdx + tag.openTagBody.length;
      closeTagLength = 0;
    }

    if (startIndex < plainTextEndIndex) {
      // change started before the end tag
      if (startIndex <= tag.plainTextBeginIndex && oldPlainTextEndIndex === plainTextEndIndex) {
        console.log('updateHTML 1.1 result', result);
        // the change is a tag or starts before the tag
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
        processedChange = '';
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        // the change is handled; exit
        break;
      } else if (startIndex >= tag.plainTextBeginIndex && oldPlainTextEndIndex < plainTextEndIndex) {
        // edge case: the change is between tag
        console.log('updateHTML 1.2 result', result);
        if (isMentionTag) {
          if (change !== '') {
            // mention tag should be deleted when user tries to edit it
            result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
            changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
            processedChange = '';
            lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
          } else {
            const [resultValue, updatedChange, htmlIndex, plainTextSelectionEndIndex] = handleMentionTagUpdate(
              htmlText,
              oldPlainText,
              lastProcessedHTMLIndex,
              processedChange,
              tag,
              closeTagIdx,
              closeTagLength,
              plainTextEndIndex,
              startIndex,
              oldPlainTextEndIndex,
              mentionTagLength
            );
            result += resultValue;
            changeNewEndIndex = plainTextSelectionEndIndex;
            processedChange = updatedChange;
            lastProcessedHTMLIndex = htmlIndex;
          }
          // the change is handled; exit
          break;
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content) {
          // with subtags
          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;
          const [content, updatedChangeNewEndIndex] = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex - mentionTagLength,
            oldPlainTextEndIndex - mentionTagLength,
            processedChange,
            mentionTrigger
          );
          result += stringBefore + content;
          changeNewEndIndex = updatedChangeNewEndIndex;
          break;
        } else {
          // no subtags
          const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
          const endChangeDiff = oldPlainTextEndIndex - tag.plainTextBeginIndex - mentionTagLength;
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff) +
            processedChange;

          processedChange = '';
          lastProcessedHTMLIndex = tag.openTagIdx + tag.openTagBody.length + endChangeDiff;
          // the change is handled; exit
          break;
        }
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.3 result', result);
        // the change started in the tag but finishes somewhere further
        const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
        if (isMentionTag) {
          const [resultValue, updatedChange, htmlIndex] = handleMentionTagUpdate(
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            oldPlainText.substring(startIndex, startIndex + 1) !== ' ' && change === '' ? ' ' : '', // if substring !== ' ' && change is empty -> the change should be " " and not empty string but " " wasn't included in change; otherwise the part of mention should be just deleted without processedChange update
            tag,
            closeTagIdx,
            closeTagLength,
            plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          );
          result += resultValue;
          lastProcessedHTMLIndex = htmlIndex;
          processedChange = updatedChange;
          // no need to handle plainTextSelectionEndIndex as the change will be added later
          // proceed with the next calculations
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;
          const [content] = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex - mentionTagLength,
            oldPlainTextEndIndex - mentionTagLength,
            '', // the part of the tag should be just deleted without processedChange update and change will be added after this tag
            mentionTrigger
          );
          result += stringBefore + content;
          // proceed with the next calculations
        } else {
          // no subtags
          result += htmlText.substring(
            lastProcessedHTMLIndex,
            tag.openTagIdx + tag.openTagBody.length + startChangeDiff
          );
          lastProcessedHTMLIndex = closeTagIdx;
          // proceed with the next calculations
        }
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.4 result', result);
        // the change starts before  the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        // no need to save anything between lastProcessedHTMLIndex and closeTagIdx + closeTagLength
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        // proceed with the next calculations
      } else if (startIndex === tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.5 result', result);
        // the change starts in the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx);
        // processedChange shouldn't be updated as it will be added after the tag
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        // proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex < plainTextEndIndex) {
        console.log('updateHTML 1.6 result', result);
        // the change  starts before the tag and ends in a tag
        if (isMentionTag) {
          const [resultValue, , htmlIndex] = handleMentionTagUpdate(
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            '', // the part of mention should be just deleted without processedChange update
            tag,
            closeTagIdx,
            closeTagLength,
            plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          );
          changeNewEndIndex = tag.plainTextBeginIndex;
          result += resultValue;
          lastProcessedHTMLIndex = htmlIndex;
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;
          const [content] = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex - mentionTagLength,
            oldPlainTextEndIndex - mentionTagLength,
            processedChange, // processedChange should equal '' and the part of the tag should be deleted as the change was handled before this tag
            mentionTrigger
          );
          result += stringBefore + content;
        } else {
          // no subtags
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length) + processedChange;
          processedChange = '';
          // oldPlainTextEndIndex already includes mentionTag length
          const endChangeDiff = plainTextEndIndex - oldPlainTextEndIndex;
          // as change may be before the end of the tag, we need to add the rest of the tag
          lastProcessedHTMLIndex = closeTagIdx - endChangeDiff;
        }
        // the change is handled; exit
        break;
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex === plainTextEndIndex) {
        console.log('updateHTML 1.7 result', result);
        // the change  starts in the tag and ends at the end of a tag
        if (isMentionTag) {
          if (change !== '' && startIndex === plainTextEndIndex) {
            // non empty change at the end of the mention tag to be added after the mention tag
            result += htmlText.substring(lastProcessedHTMLIndex, closeTagIdx + closeTagLength) + processedChange;
            changeNewEndIndex = plainTextEndIndex + processedChange.length;
            processedChange = '';
            lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
          } else if (change !== '') {
            // mention tag should be deleted when user tries to edit it
            result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
            changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
            processedChange = '';
            lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
          } else {
            const [resultValue, updatedChange, htmlIndex, plainTextSelectionEndIndex] = handleMentionTagUpdate(
              htmlText,
              oldPlainText,
              lastProcessedHTMLIndex,
              processedChange,
              tag,
              closeTagIdx,
              closeTagLength,
              plainTextEndIndex,
              startIndex,
              oldPlainTextEndIndex,
              mentionTagLength
            );
            result += resultValue;
            processedChange = updatedChange;
            lastProcessedHTMLIndex = htmlIndex;
            changeNewEndIndex = plainTextSelectionEndIndex;
          }
          // the change is handled; exit
          break;
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags

          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;

          const [content, updatedChangeNewEndIndex] = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex - mentionTagLength,
            oldPlainTextEndIndex - mentionTagLength,
            processedChange,
            mentionTrigger
          );
          result += stringBefore + content;
          changeNewEndIndex = updatedChangeNewEndIndex;
          break;
        } else {
          // no subtags
          const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff) +
            processedChange;
          processedChange = '';
          lastProcessedHTMLIndex = closeTagIdx;
          // the change is handled; exit
          break;
        }
      }
      lastProcessedPlainTextTagEndIndex = plainTextEndIndex;
    }
    if (i === tags.length - 1 && oldPlainTextEndIndex >= plainTextEndIndex) {
      console.log('updateHTML 2 result', result);
      // the last tag should handle the end of the change if needed
      // oldPlainTextEndIndex already includes mentionTag length
      const endChangeDiff = oldPlainTextEndIndex - plainTextEndIndex;
      if (startIndex >= plainTextEndIndex) {
        const startChangeDiff = startIndex - plainTextEndIndex;
        result +=
          htmlText.substring(lastProcessedHTMLIndex, closeTagIdx + closeTagLength + startChangeDiff) + processedChange;
      } else {
        result += htmlText.substring(lastProcessedHTMLIndex, closeTagIdx + closeTagLength) + processedChange;
      }
      processedChange = '';
      lastProcessedHTMLIndex = closeTagIdx + closeTagLength + endChangeDiff;
      // the change is handled; exit
      // break is not required here as this is the last element but added for consistency
      break;
    }
  }

  if (lastProcessedHTMLIndex < htmlText.length) {
    result += htmlText.substring(lastProcessedHTMLIndex);
  }

  console.log('updateHTML result "', result, '"');
  return [result, changeNewEndIndex];
};

/* @conditional-compile-remove(mention) */
/**
 * Given the oldText and newText, find the start index, old end index and new end index for the changes
 *
 * @param oldText - the old text
 * @param newText - the new text
 * @param selectionEnd - the end of the selection
 * @returns change start index, old end index and new end index. The old and new end indexes are exclusive.
 * @private
 */
const findStringsDiffIndexes = (
  oldText: string,
  newText: string,
  selectionEnd: number // should be a valid position in the input field
): { changeStart: number; oldChangeEnd: number; newChangeEnd: number } => {
  const newTextLength = newText.length;
  const oldTextLength = oldText.length;
  let changeStart = 0;
  let newChangeEnd = newTextLength;
  let oldChangeEnd = oldTextLength;
  const length = Math.min(newTextLength, oldTextLength, selectionEnd);

  for (let i = 0; i < length; i++) {
    if (newText[i] !== oldText[i]) {
      // the symbol with changeStart index is updated
      changeStart = i;
      break;
    } else if (i === length - 1 && newText[i] === oldText[i]) {
      // the symbol is added at the end of inputTextValue
      changeStart = length;
      break;
    }
  }
  if (oldTextLength < newTextLength) {
    //insert or replacement
    if (oldTextLength === changeStart) {
      // when change was at the end of string
      // Change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < newTextLength && oldTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;

        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
      // make indexes exclusive
      newChangeEnd += 1;
      oldChangeEnd += 1;
    }
  } else if (oldTextLength > newTextLength) {
    //deletion or replacement
    if (newTextLength === changeStart) {
      // when change was at the end of string
      // Change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < oldTextLength && newTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
      // make indexes exclusive
      newChangeEnd += 1;
      oldChangeEnd += 1;
    }
  } else {
    //replacement
    for (let i = 1; i < oldTextLength && oldTextLength - i >= changeStart; i++) {
      newChangeEnd = newTextLength - i - 1;
      oldChangeEnd = oldTextLength - i - 1;

      if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
        // Change is found
        break;
      }
    }
    // make indexes exclusive if they aren't equal to the length of the string
    if (newChangeEnd !== newText.length) {
      newChangeEnd += 1;
    }
    if (oldChangeEnd !== oldText.length) {
      oldChangeEnd += 1;
    }
  }
  return { changeStart, oldChangeEnd, newChangeEnd };
};

/* @conditional-compile-remove(mention) */
const htmlStringForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const idHTML = ' id ="' + suggestion.id + '"';
  const displayTextHTML = ' displayText ="' + suggestion.displayText + '"';
  const displayText = getDisplayNameForMentionSuggestion(suggestion, localeStrings);
  return '<msft-mention' + idHTML + displayTextHTML + '>' + displayText + '</msft-mention>';
};

/* @conditional-compile-remove(mention) */
const getDisplayNameForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const displayNamePlaceholder = localeStrings.participantItem.displayNamePlaceholder;
  return suggestion.displayText !== '' ? suggestion.displayText : displayNamePlaceholder ?? '';
};

/* @conditional-compile-remove(mention) */
type TagData = {
  tagType: string; // The type of tag (e.g. msft-mention)
  openTagIdx: number; // Start of the tag relative to the parent content
  openTagBody: string; // Complete open tag body
  content?: string; // All content between the open and close tags
  closeTagIdx?: number; // Start of the close tag relative to the parent content
  subTags?: TagData[]; // Any child tags
  plainTextBeginIndex?: number; // Absolute index of the open tag start should be in plain text
  plainTextEndIndex?: number; // Absolute index of the close tag start should be in plain text
};

/* @conditional-compile-remove(mention) */
type HtmlTagType = 'open' | 'close' | 'self-closing';
/* @conditional-compile-remove(mention) */
type HtmlTag = {
  content: string;
  startIdx: number;
  type: HtmlTagType;
};

/* @conditional-compile-remove(mention) */
/**
 * Parse the text and return the tags and the plain text in one go
 * @param text - The text to parse for HTML tags
 * @param trigger The trigger to show for the msft-mention tag in plain text
 *
 * @returns An array of tags and the plain text representation
 */
const textToTagParser = (text: string, trigger: string): [TagData[], string] => {
  const tags: TagData[] = []; // Tags passed back to the caller
  const tagParseStack: TagData[] = []; // Local stack to use while parsing

  let plainTextRepresentation = '';

  let parseIndex = 0;
  while (parseIndex < text.length) {
    // console.log('Parsing at index ' + parseIndex + ' of ' + text.length);
    const foundHtmlTag = findNextHtmlTag(text, parseIndex);

    if (!foundHtmlTag) {
      if (parseIndex !== 0) {
        // Add the remaining text to the plain text representation
        plainTextRepresentation += text.substring(parseIndex);
      } else {
        plainTextRepresentation = text;
      }
      break;
    }

    if (foundHtmlTag.type === 'open' || foundHtmlTag.type === 'self-closing') {
      const nextTag = parseOpenTag(foundHtmlTag.content, foundHtmlTag.startIdx);
      // Add the plain text between the last tag and this one found
      plainTextRepresentation += text.substring(parseIndex, foundHtmlTag.startIdx);
      nextTag.plainTextBeginIndex = plainTextRepresentation.length;

      if (foundHtmlTag.type === 'open') {
        tagParseStack.push(nextTag);
      } else {
        // console.log('Found self-closing tag: ' + foundHtmlTag.content);
        nextTag.content = '';
        nextTag.plainTextBeginIndex = plainTextRepresentation.length;
        nextTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(nextTag, tagParseStack, tags);
      }
    }

    if (foundHtmlTag.type === 'close') {
      // console.log('Found close tag: ' + foundHtmlTag.content);
      const currentOpenTag = tagParseStack.pop();
      const closeTagType = foundHtmlTag.content.substring(2, foundHtmlTag.content.length - 1).toLowerCase();

      if (currentOpenTag && currentOpenTag.tagType === closeTagType) {
        // console.log('closing tag: ' + currentOpenTag.tagType + '');

        // Tag startIdx is absolute to the text. This is updated later to be relative to the parent tag
        currentOpenTag.content = text.substring(
          currentOpenTag.openTagIdx + currentOpenTag.openTagBody.length,
          foundHtmlTag.startIdx
        );

        // Insert the plain text pieces for the sub tags
        if (currentOpenTag.tagType === 'msft-mention') {
          plainTextRepresentation =
            plainTextRepresentation.slice(0, currentOpenTag.plainTextBeginIndex) +
            trigger +
            plainTextRepresentation.slice(currentOpenTag.plainTextBeginIndex);
        }

        if (!currentOpenTag.subTags) {
          plainTextRepresentation += currentOpenTag.content;
        } else if (currentOpenTag.subTags.length > 0) {
          // Add text after the last tag
          const lastSubTag = currentOpenTag.subTags[currentOpenTag.subTags.length - 1];
          const startOfRemainingText =
            (lastSubTag.closeTagIdx ?? lastSubTag.openTagIdx) + lastSubTag.tagType.length + 3;
          const trailingText = currentOpenTag.content.substring(startOfRemainingText);
          plainTextRepresentation += trailingText;
        }

        currentOpenTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(currentOpenTag, tagParseStack, tags);
      } else {
        console.error(
          'Unexpected close tag found. Got "' +
            closeTagType +
            '" but expected "' +
            tagParseStack[tagParseStack.length - 1]?.tagType +
            '"'
        );
      }
    }

    // Update parsing index; move past the end of the close tag
    parseIndex = foundHtmlTag.startIdx + foundHtmlTag.content.length;
  } // While parseIndex < text.length loop

  return [tags, plainTextRepresentation];
};

/* @conditional-compile-remove(mention) */
const parseOpenTag = (tag: string, startIdx: number): TagData => {
  const tagType = tag
    .substring(1, tag.length - 1)
    .split(' ')[0]
    .toLowerCase()
    .replace('/', '');
  return {
    tagType,
    openTagIdx: startIdx,
    openTagBody: tag
  };
};

/* @conditional-compile-remove(mention) */
const findNextHtmlTag = (text: string, startIndex: number): HtmlTag | undefined => {
  const tagStartIndex = text.indexOf('<', startIndex);
  if (tagStartIndex === -1) {
    // No more tags
    return undefined;
  }
  const tagEndIndex = text.indexOf('>', tagStartIndex);
  if (tagEndIndex === -1) {
    // No close tag
    return undefined;
  }
  const tag = text.substring(tagStartIndex, tagEndIndex + 1);
  let type: HtmlTagType = 'open';
  if (tag[1] === '/') {
    type = 'close';
  } else if (tag[tag.length - 2] === '/') {
    type = 'self-closing';
  }
  return {
    content: tag,
    startIdx: tagStartIndex,
    type
  };
};

/* @conditional-compile-remove(mention) */
const addTag = (tag: TagData, parseStack: TagData[], tags: TagData[]): void => {
  // Add as sub-tag to the parent stack tag, if there is one
  const parentTag = parseStack[parseStack.length - 1];

  if (parentTag) {
    // Adjust the open tag index to be relative to the parent tag
    const parentContentStartIdx = parentTag.openTagIdx + parentTag.openTagBody.length;
    const relativeIdx = tag.openTagIdx - parentContentStartIdx;
    tag.openTagIdx = relativeIdx;
  }

  if (!tag.closeTagIdx) {
    // If the tag is self-closing, the close tag is the same as the open tag
    if (tag.openTagBody[tag.openTagBody.length - 2] === '/') {
      tag.closeTagIdx = tag.openTagIdx;
    } else {
      // Otherwise, the close tag index is the open tag index + the open tag body + the content length
      tag.closeTagIdx = tag.openTagIdx + tag.openTagBody.length + (tag.content ?? []).length;
    }
  }

  // Put the tag where it belongs
  if (!parentTag) {
    tags.push(tag);
  } else {
    if (!parentTag.subTags) {
      parentTag.subTags = [tag];
    } else {
      parentTag.subTags.push(tag);
    }
  }
};
