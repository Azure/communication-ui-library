// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentStrings } from '../../localization';
import { Mention } from '../MentionPopover';

const MSFT_MENTION_TAG = 'msft-mention';

/**
 * Props for finding a valid index in range.
 *
 * @private
 */
type ValidatedIndexRangeProps = {
  min: number;
  max: number;
  currentValue?: number;
};

/**
 * Get validated value for index between min and max values. If currentValue is not defined, -1 will be used instead.
 *
 * @private
 * @param props - Props for finding a valid index in range.
 * @returns Valid index in the range.
 */
export const getValidatedIndexInRange = (props: ValidatedIndexRangeProps): number => {
  const { min, max, currentValue } = props;
  let updatedValue = currentValue ?? -1;
  updatedValue = Math.max(min, updatedValue);
  updatedValue = Math.min(updatedValue, max);
  return updatedValue;
};

/**
 * Find mention tag for selection if exists.
 *
 * @private
 * @param tags - Existing list of tags.
 * @param selection - Selection index.
 * @returns Mention tag if exists, otherwise undefined.
 */
export const findMentionTagForSelection = (tags: TagData[], selection: number): TagData | undefined => {
  let mentionTag: TagData | undefined = undefined;
  tags.every((tag) => {
    const closingTagInfo = getTagClosingTagInfo(tag);
    if (tag.plainTextBeginIndex !== undefined && tag.plainTextBeginIndex > selection) {
      // no need to check further as the selection is before the tag
      return false;
    } else if (
      tag.plainTextBeginIndex !== undefined &&
      tag.plainTextBeginIndex <= selection &&
      selection <= closingTagInfo.plainTextEndIndex
    ) {
      // no need to check if tag doesn't contain selection
      if (tag.subTags !== undefined && tag.subTags.length !== 0) {
        const selectedTag = findMentionTagForSelection(tag.subTags, selection);
        if (selectedTag !== undefined) {
          mentionTag = selectedTag;
          return false;
        }
      } else if (tag.tagType === MSFT_MENTION_TAG) {
        mentionTag = tag;
        return false;
      }
    }
    return true;
  });
  return mentionTag;
};

/**
 * Props for finding new selection index for mention
 *
 * @private
 */
type NewSelectionIndexForMentionProps = {
  tag: TagData;
  textValue: string;
  currentSelectionIndex: number;
  previousSelectionIndex: number;
};

/**
 * Find a new the selection index.
 *
 * @private
 * @param props - Props for finding new selection index for mention.
 * @returns New selection index if it is inside of a mention tag, otherwise the current selection.
 */
export const findNewSelectionIndexForMention = (props: NewSelectionIndexForMentionProps): number => {
  const { tag, textValue, currentSelectionIndex, previousSelectionIndex } = props;
  // check if this is a mention tag and selection should be updated
  if (
    tag.tagType !== MSFT_MENTION_TAG ||
    tag.plainTextBeginIndex === undefined ||
    currentSelectionIndex === previousSelectionIndex ||
    tag.plainTextEndIndex === undefined
  ) {
    return currentSelectionIndex;
  }
  let spaceIndex = 0;
  if (currentSelectionIndex <= previousSelectionIndex) {
    // the cursor is moved to the left, find the last index before the cursor
    spaceIndex = textValue.lastIndexOf(' ', currentSelectionIndex ?? 0);
    if (spaceIndex === -1) {
      // no space before the selection, use the beginning of the tag
      spaceIndex = tag.plainTextBeginIndex;
    }
  } else {
    // the cursor is moved to the right, find the fist index after the cursor
    spaceIndex = textValue.indexOf(' ', currentSelectionIndex ?? 0);
    if (spaceIndex === -1) {
      // no space after the selection, use the end of the tag
      spaceIndex = tag.plainTextEndIndex ?? tag.plainTextBeginIndex;
    }
  }
  spaceIndex = getValidatedIndexInRange({
    min: tag.plainTextBeginIndex,
    max: tag.plainTextEndIndex,
    currentValue: spaceIndex
  });
  return spaceIndex;
};

/**
 * Props for mention update HTML function
 *
 * @private
 */
type MentionTagUpdateProps = {
  htmlText: string;
  oldPlainText: string;
  lastProcessedHTMLIndex: number;
  processedChange: string;
  change: string;
  tag: TagData;
  closeTagIdx: number;
  closeTagLength: number;
  plainTextEndIndex: number;
  startIndex: number;
  oldPlainTextEndIndex: number;
  mentionTagLength: number;
};

/**
 * Result for mention update HTML function
 *
 * @private
 */
type MentionTagUpdateResult = {
  result: string;
  updatedChange: string;
  htmlIndex: number;
  plainTextSelectionEndIndex?: number;
};

/**
 * Handle mention tag edit and by word deleting
 *
 * @private
 * @param props - Props for mention update HTML function.
 * @returns Updated texts and indexes.
 */
const handleMentionTagUpdate = (props: MentionTagUpdateProps): MentionTagUpdateResult => {
  const {
    htmlText,
    oldPlainText,
    change,
    tag,
    closeTagIdx,
    closeTagLength,
    plainTextEndIndex,
    startIndex,
    oldPlainTextEndIndex,
    mentionTagLength
  } = props;
  let processedChange = props.processedChange;
  let lastProcessedHTMLIndex = props.lastProcessedHTMLIndex;
  if (tag.tagType !== MSFT_MENTION_TAG || tag.plainTextBeginIndex === undefined) {
    // not a mention tag
    return {
      result: '',
      updatedChange: processedChange,
      htmlIndex: lastProcessedHTMLIndex,
      plainTextSelectionEndIndex: undefined
    };
  }
  let result = '';
  let plainTextSelectionEndIndex: number | undefined;
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
    // rangeStart should be at least equal to tag.plainTextBeginIndex
    rangeStart = tag.plainTextBeginIndex;
  }
  if (rangeEnd > plainTextEndIndex) {
    // rangeEnd should be at most equal to plainTextEndIndex
    rangeEnd = plainTextEndIndex;
  }
  if (rangeStart === tag.plainTextBeginIndex && rangeEnd === plainTextEndIndex) {
    // the whole tag should be removed
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex) + processedChange;
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
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length + startChangeDiff);

    if (startIndex < tag.plainTextBeginIndex) {
      // if the change is before the tag, the selection should start from startIndex (rangeStart will be equal to tag.plainTextBeginIndex)
      plainTextSelectionEndIndex = startIndex + change.length;
    } else {
      // if the change is inside the tag, the selection should start with rangeStart
      plainTextSelectionEndIndex = rangeStart + processedChange.length;
    }
    lastProcessedHTMLIndex = tag.openTagIndex + tag.openTagBody.length + endChangeDiff;
    // processed change should not be changed as it should be added after the tag
  }
  return { result, updatedChange: processedChange, htmlIndex: lastProcessedHTMLIndex, plainTextSelectionEndIndex };
};

/**
 * Closing tag information
 *
 * @private
 */
type ClosingTagInfoResult = {
  plainTextEndIndex: number;
  closeTagIdx: number;
  closeTagLength: number;
};

/**
 * Get closing tag information if exists otherwise return information as for self closing tag
 *
 * @private
 * @param tag - Tag data.
 * @returns Closing tag information for the provided tag.
 */
const getTagClosingTagInfo = (tag: TagData): ClosingTagInfoResult => {
  let plainTextEndIndex = 0;
  let closeTagIdx = 0;
  let closeTagLength = 0;
  if (tag.plainTextEndIndex !== undefined && tag.closingTagIndex !== undefined) {
    // close tag exists
    plainTextEndIndex = tag.plainTextEndIndex;
    closeTagIdx = tag.closingTagIndex;
    // tag.tagType.length + </>
    closeTagLength = tag.tagType.length + 3;
  } else if (tag.plainTextBeginIndex !== undefined) {
    // no close tag
    plainTextEndIndex = tag.plainTextBeginIndex;
    closeTagIdx = tag.openTagIndex + tag.openTagBody.length;
    closeTagLength = 0;
  }
  return { plainTextEndIndex, closeTagIdx, closeTagLength };
};

/**
 * Props for update HTML function
 *
 * @private
 */
type UpdateHTMLProps = {
  htmlText: string;
  oldPlainText: string;
  newPlainText: string;
  tags: TagData[];
  startIndex: number;
  oldPlainTextEndIndex: number;
  change: string;
  mentionTrigger: string;
};

/**
 * Go through the text and update it with the changed text
 *
 * @private
 * @param props - Props for update HTML function.
 * @returns Updated HTML and selection index if the selection index should be set.
 */
export const updateHTML = (props: UpdateHTMLProps): { updatedHTML: string; updatedSelectionIndex?: number } => {
  const { htmlText, oldPlainText, newPlainText, tags, startIndex, oldPlainTextEndIndex, change, mentionTrigger } =
    props;
  if (tags.length === 0 || (startIndex === 0 && oldPlainTextEndIndex === oldPlainText.length - 1)) {
    // no tags added yet or the whole text is changed
    return { updatedHTML: newPlainText, updatedSelectionIndex: undefined };
  }
  let result = '';
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
  // as some tags/text can be removed fully, selection should be updated correctly
  let changeNewEndIndex: number | undefined;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.plainTextBeginIndex === undefined) {
      continue;
    }
    // all plain text indexes includes trigger length for the mention that shouldn't be included in
    // htmlText.substring because html strings don't include the trigger
    // mentionTagLength will be set only for mention tag, otherwise should be 0
    let mentionTagLength = 0;
    let isMentionTag = false;
    if (tag.tagType === MSFT_MENTION_TAG) {
      mentionTagLength = mentionTrigger.length;
      isMentionTag = true;
    }
    if (startIndex <= tag.plainTextBeginIndex) {
      // change start is before the open tag
      // Math.max(lastProcessedPlainTextTagEndIndex, startIndex) is used as startIndex may not be in [[previous tag].plainTextEndIndex - tag.plainTextBeginIndex] range
      const startChangeDiff = tag.plainTextBeginIndex - Math.max(lastProcessedPlainTextTagEndIndex, startIndex);
      result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex - startChangeDiff) + processedChange;
      processedChange = '';
      if (oldPlainTextEndIndex <= tag.plainTextBeginIndex) {
        // the whole change is before tag start
        // mentionTag length can be ignored here as the change is before the tag
        const endChangeDiff = tag.plainTextBeginIndex - oldPlainTextEndIndex;
        lastProcessedHTMLIndex = tag.openTagIndex - endChangeDiff;
        // the change is handled; exit
        break;
      } else {
        // change continues in the tag
        lastProcessedHTMLIndex = tag.openTagIndex;
        // proceed to the next check
      }
    }
    const closingTagInfo = getTagClosingTagInfo(tag);
    if (startIndex <= closingTagInfo.plainTextEndIndex) {
      // change started before the end tag
      if (startIndex <= tag.plainTextBeginIndex && oldPlainTextEndIndex === closingTagInfo.plainTextEndIndex) {
        // the change is a tag or starts before the tag
        // tag should be removed, no matter if there are sub-tags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex) + processedChange;
        processedChange = '';
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // the change is handled; exit
        break;
      } else if (startIndex >= tag.plainTextBeginIndex && oldPlainTextEndIndex <= closingTagInfo.plainTextEndIndex) {
        // the change is between the tag
        if (isMentionTag) {
          if (change !== '') {
            if (startIndex !== tag.plainTextBeginIndex && startIndex !== closingTagInfo.plainTextEndIndex) {
              // mention tag should be deleted when user tries to edit it in the middle
              result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex) + processedChange;
              changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
              lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
            } else if (startIndex === tag.plainTextBeginIndex) {
              // non empty change at the beginning of the mention tag to be added before the mention tag
              result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex) + processedChange;
              changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
              lastProcessedHTMLIndex = tag.openTagIndex;
            } else if (startIndex === closingTagInfo.plainTextEndIndex) {
              // non empty change at the end of the mention tag to be added after the mention tag
              result +=
                htmlText.substring(lastProcessedHTMLIndex, closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength) +
                processedChange;
              changeNewEndIndex = closingTagInfo.plainTextEndIndex + processedChange.length;
              lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
            }
            processedChange = '';
          } else {
            const updateMentionTagResult = handleMentionTagUpdate({
              htmlText,
              oldPlainText,
              lastProcessedHTMLIndex,
              processedChange,
              change,
              tag,
              closeTagIdx: closingTagInfo.closeTagIdx,
              closeTagLength: closingTagInfo.closeTagLength,
              plainTextEndIndex: closingTagInfo.plainTextEndIndex,
              startIndex,
              oldPlainTextEndIndex,
              mentionTagLength
            });
            result += updateMentionTagResult.result;
            changeNewEndIndex = updateMentionTagResult.plainTextSelectionEndIndex;
            processedChange = updateMentionTagResult.updatedChange;
            lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
          }
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: processedChange,
            mentionTrigger
          });
          result += stringBefore + updatedContent.updatedHTML;
          changeNewEndIndex = updatedContent.updatedSelectionIndex;
        } else {
          // no subtags
          const startChangeDiff = startIndex - tag.plainTextBeginIndex;
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length + startChangeDiff) +
            processedChange;
          processedChange = '';
          if (oldPlainTextEndIndex < closingTagInfo.plainTextEndIndex) {
            const endChangeDiff = oldPlainTextEndIndex - tag.plainTextBeginIndex;
            lastProcessedHTMLIndex = tag.openTagIndex + tag.openTagBody.length + endChangeDiff;
          } else if (oldPlainTextEndIndex === closingTagInfo.plainTextEndIndex) {
            lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          }
        }
        // the change is handled; exit
        break;
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change started in the tag but finishes somewhere further
        const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
        if (isMentionTag) {
          const updateMentionTagResult = handleMentionTagUpdate({
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            processedChange: '',
            change,
            tag,
            closeTagIdx: closingTagInfo.closeTagIdx,
            closeTagLength: closingTagInfo.closeTagLength,
            plainTextEndIndex: closingTagInfo.plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          });
          result += updateMentionTagResult.result;
          lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
          // no need to handle plainTextSelectionEndIndex as the change will be added later
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: '', // the part of the tag should be just deleted without processedChange update and change will be added after this tag
            mentionTrigger
          });
          result += stringBefore + updatedContent.updatedHTML;
        } else {
          // no subtags
          result += htmlText.substring(
            lastProcessedHTMLIndex,
            tag.openTagIndex + tag.openTagBody.length + startChangeDiff
          );
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
        }
        // proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change starts before  the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        // no need to save anything between lastProcessedHTMLIndex and closeTagIdx + closeTagLength
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // proceed with the next calculations
      } else if (startIndex === tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change starts in the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex);
        // processedChange shouldn't be updated as it will be added after the tag
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex < closingTagInfo.plainTextEndIndex) {
        // the change  starts before the tag and ends in a tag
        if (isMentionTag) {
          // mention tag
          const updateMentionTagResult = handleMentionTagUpdate({
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            processedChange: '', // the part of mention should be just deleted without processedChange update
            change,
            tag,
            closeTagIdx: closingTagInfo.closeTagIdx,
            closeTagLength: closingTagInfo.closeTagLength,
            plainTextEndIndex: closingTagInfo.plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          });
          changeNewEndIndex = updateMentionTagResult.plainTextSelectionEndIndex;
          result += updateMentionTagResult.result;
          lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: processedChange, // processedChange should be equal '' and the part of the tag should be deleted as the change was handled before this tag
            mentionTrigger
          });
          processedChange = '';
          result += stringBefore + updatedContent.updatedHTML;
        } else {
          // no subtags
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIndex + tag.openTagBody.length) + processedChange;
          processedChange = '';
          // oldPlainTextEndIndex already includes mentionTag length
          const endChangeDiff = closingTagInfo.plainTextEndIndex - oldPlainTextEndIndex;
          // as change may be before the end of the tag, we need to add the rest of the tag
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx - endChangeDiff;
        }
        // the change is handled; exit
        break;
      }
      lastProcessedPlainTextTagEndIndex = closingTagInfo.plainTextEndIndex;
    }

    if (i === tags.length - 1 && oldPlainTextEndIndex >= closingTagInfo.plainTextEndIndex) {
      // the last tag should handle the end of the change if needed
      // oldPlainTextEndIndex already includes mentionTag length
      const endChangeDiff = oldPlainTextEndIndex - closingTagInfo.plainTextEndIndex;
      if (startIndex >= closingTagInfo.plainTextEndIndex) {
        const startChangeDiff = startIndex - closingTagInfo.plainTextEndIndex;
        result +=
          htmlText.substring(
            lastProcessedHTMLIndex,
            closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength + startChangeDiff
          ) + processedChange;
      } else {
        result +=
          htmlText.substring(lastProcessedHTMLIndex, closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength) +
          processedChange;
      }
      processedChange = '';
      lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength + endChangeDiff;
      // the change is handled; exit
      // break is not required here as this is the last element but added for consistency
      break;
    }
  }
  if (lastProcessedHTMLIndex < htmlText.length) {
    // add the rest of the html string
    result += htmlText.substring(lastProcessedHTMLIndex);
  }
  return { updatedHTML: result, updatedSelectionIndex: changeNewEndIndex };
};

/**
 * Props for finding strings diff indexes
 *
 * @private
 */
type DiffIndexesProps = {
  // the old text
  oldText: string;
  // the new text
  newText: string;
  // the start of previous selection, should be a valid position in the input field
  previousSelectionStart: number;
  // the end of previous selection, should be a valid position in the input field
  previousSelectionEnd: number;
  // the start of current selection, should be a valid position in the input field
  currentSelectionStart: number;
  // the end of current selection, should be a valid position in the input field
  currentSelectionEnd: number;
};

/**
 * Result of finding strings diff indexes function
 *
 * @private
 */
type DiffIndexesResult = {
  changeStart: number;
  oldChangeEnd: number;
  newChangeEnd: number;
};

/**
 * Given the oldText and newText, find the start index, old end index and new end index for the changes
 *
 * @private
 * @param props - Props for finding stings diff indexes function.
 * @returns Indexes for change start and ends in new and old texts. The old and new end indexes are exclusive.
 */
export const findStringsDiffIndexes = (props: DiffIndexesProps): DiffIndexesResult => {
  const { oldText, newText, previousSelectionStart, previousSelectionEnd, currentSelectionStart, currentSelectionEnd } =
    props;
  const newTextLength = newText.length;
  const oldTextLength = oldText.length;
  // let changeStart = 0;
  let newChangeEnd = newTextLength;
  let oldChangeEnd = oldTextLength;
  const previousSelectionStartValue = previousSelectionStart > -1 ? previousSelectionStart : oldTextLength;
  const previousSelectionEndValue = previousSelectionEnd > -1 ? previousSelectionEnd : oldTextLength;
  const currentSelectionStartValue = currentSelectionStart > -1 ? currentSelectionStart : newTextLength;
  const currentSelectionEndValue = currentSelectionEnd > -1 ? currentSelectionEnd : newTextLength;
  const changeStart = Math.min(
    previousSelectionStartValue,
    previousSelectionEndValue,
    currentSelectionStartValue,
    currentSelectionEndValue,
    newTextLength,
    oldTextLength
  );

  if (oldTextLength < newTextLength) {
    //insert or replacement
    if (oldTextLength === changeStart) {
      // when change was at the end of string
      // change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < newTextLength && oldTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;

        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // change is found
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
      // change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < oldTextLength && newTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // change is found
          break;
        }
      }
      // make indexes exclusive
      newChangeEnd += 1;
      oldChangeEnd += 1;
    }
  } else {
    // replacement
    for (let i = 1; i < oldTextLength && oldTextLength - i >= changeStart; i++) {
      newChangeEnd = newTextLength - i - 1;
      oldChangeEnd = oldTextLength - i - 1;

      if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
        // change is found
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

/**
 * Get the html string for the mention suggestion.
 *
 * @private
 * @param suggestion - The mention suggestion.
 * @param localeStrings - The locale strings.
 * @returns The html string for the mention suggestion.
 */
export const htmlStringForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const idHTML = ' id="' + suggestion.id + '"';
  const displayText = getDisplayNameForMentionSuggestion(suggestion, localeStrings);
  return '<' + MSFT_MENTION_TAG + idHTML + '>' + displayText + '</' + MSFT_MENTION_TAG + '>';
};

/**
 * Get display name for the mention suggestion.
 *
 * @private
 *
 * @param suggestion - The mention suggestion.
 * @param localeStrings - The locale strings.
 * @returns The display name for the mention suggestion or display name placeholder if display name is empty.
 */
export const getDisplayNameForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const displayNamePlaceholder = localeStrings.participantItem.displayNamePlaceholder;
  return suggestion.displayText !== '' ? suggestion.displayText : displayNamePlaceholder ?? '';
};

/**
 * Tag data for a HTML tag in the string
 *
 * @private
 */
export type TagData = {
  tagType: string; // The type of tag (e.g. msft-mention)
  openTagIndex: number; // Start of the tag relative to the parent content
  openTagBody: string; // Complete open tag body
  content?: string; // All content between the open and close tags
  closingTagIndex?: number; // Start of the close tag relative to the parent content
  subTags?: TagData[]; // Any child tags
  plainTextBeginIndex?: number; // Absolute index of the open tag start should be in plain text
  plainTextEndIndex?: number; // Absolute index of the close tag start should be in plain text
};

type HtmlTagType = 'open' | 'close' | 'self-closing';

type HtmlTag = {
  content: string;
  startIdx: number;
  type: HtmlTagType;
};

/**
 * Parse the text and return the tags and the plain text in one go
 * @private
 * @param text - The text to parse for HTML tags
 * @param trigger The trigger to show for the mention tag in plain text
 *
 * @returns An array of tags and the plain text representation
 */
export const textToTagParser = (text: string, trigger: string): { tags: TagData[]; plainText: string } => {
  const tags: TagData[] = []; // Tags passed back to the caller
  const tagParseStack: TagData[] = []; // Local stack to use while parsing

  let plainTextRepresentation = '';

  let parseIndex = 0;
  while (parseIndex < text.length) {
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
        nextTag.content = '';
        nextTag.plainTextBeginIndex = plainTextRepresentation.length;
        nextTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(nextTag, tagParseStack, tags);
      }
    }

    if (foundHtmlTag.type === 'close') {
      const currentOpenTag = tagParseStack.pop();
      const closeTagType = foundHtmlTag.content.substring(2, foundHtmlTag.content.length - 1).toLowerCase();

      if (currentOpenTag && currentOpenTag.tagType === closeTagType) {
        // Tag startIdx is absolute to the text. This is updated later to be relative to the parent tag
        currentOpenTag.content = text.substring(
          currentOpenTag.openTagIndex + currentOpenTag.openTagBody.length,
          foundHtmlTag.startIdx
        );

        // Insert the plain text pieces for the sub tags
        if (currentOpenTag.tagType === MSFT_MENTION_TAG) {
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
            (lastSubTag.closingTagIndex ?? lastSubTag.openTagIndex) + lastSubTag.tagType.length + 3;
          const trailingText = currentOpenTag.content.substring(startOfRemainingText);
          plainTextRepresentation += trailingText;
        }

        currentOpenTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(currentOpenTag, tagParseStack, tags);
      } else {
        throw new Error(
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

  return { tags, plainText: plainTextRepresentation };
};

const parseOpenTag = (tag: string, startIdx: number): TagData => {
  const tagType = tag
    .substring(1, tag.length - 1)
    .split(' ')[0]
    .toLowerCase()
    .replace('/', '');
  return {
    tagType,
    openTagIndex: startIdx,
    openTagBody: tag
  };
};

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

const addTag = (tag: TagData, parseStack: TagData[], tags: TagData[]): void => {
  // Add as sub-tag to the parent stack tag, if there is one
  const parentTag = parseStack[parseStack.length - 1];

  if (parentTag) {
    // Adjust the open tag index to be relative to the parent tag
    const parentContentStartIdx = parentTag.openTagIndex + parentTag.openTagBody.length;
    const relativeIdx = tag.openTagIndex - parentContentStartIdx;
    tag.openTagIndex = relativeIdx;
  }

  if (!tag.closingTagIndex) {
    // If the tag is self-closing, the close tag is the same as the open tag
    if (tag.openTagBody[tag.openTagBody.length - 2] === '/') {
      tag.closingTagIndex = tag.openTagIndex;
    } else {
      // Otherwise, the close tag index is the open tag index + the open tag body + the content length
      tag.closingTagIndex = tag.openTagIndex + tag.openTagBody.length + (tag.content ?? []).length;
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
