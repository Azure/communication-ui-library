// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Mention } from '../MentionPopover';
import {
  TagData,
  findMentionTagForSelection,
  findNewSelectionIndexForMention,
  findStringsDiffIndexes,
  getDisplayNameForMentionSuggestion,
  getValidatedIndexInRange,
  htmlStringForMentionSuggestion,
  rangeOfWordInSelection,
  textToTagParser,
  updateHTML
} from './mentionTagUtils';

import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';

describe('Mention logic should be robust and accurate', () => {
  const localeStrings = COMPONENT_LOCALE_EN_US.strings;

  const basicMention = 'Hello <msft-mention id="1">everyone</msft-mention>!';
  const basicMentionTextRepresentation = 'Hello @everyone!';
  const basicMentionTag: TagData = {
    closingTagIndex: 35,
    content: 'everyone',
    openTagBody: '<msft-mention id="1">',
    openTagIndex: 6,
    plainTextBeginIndex: 6,
    plainTextEndIndex: 15,
    tagType: 'msft-mention'
  };
  const nestedMention = '<p><b>Hello</b> <msft-mention id="1">everyone</msft-mention></p><em>!</em>';
  const nestedMentionTextRepresentation = 'Hello #éeveryone!';
  const nestedMentionTags: TagData[] = [
    {
      closingTagIndex: 60,
      content: '<b>Hello</b> <msft-mention id="1">everyone</msft-mention>',
      openTagBody: '<p>',
      openTagIndex: 0,
      plainTextBeginIndex: 0,
      plainTextEndIndex: 16,
      subTags: [
        {
          closingTagIndex: 8,
          content: 'Hello',
          openTagBody: '<b>',
          openTagIndex: 0,
          plainTextBeginIndex: 0,
          plainTextEndIndex: 5,
          tagType: 'b'
        },
        {
          closingTagIndex: 42,
          content: 'everyone',
          openTagBody: '<msft-mention id="1">',
          openTagIndex: 13,
          plainTextBeginIndex: 6,
          plainTextEndIndex: 16,
          tagType: 'msft-mention'
        }
      ],
      tagType: 'p'
    },
    {
      closingTagIndex: 69,
      content: '!',
      openTagBody: '<em>',
      openTagIndex: 64,
      plainTextBeginIndex: 16,
      plainTextEndIndex: 17,
      tagType: 'em'
    }
  ];

  const twoWordMention = 'Hello <msft-mention id="1">Patricia Adams</msft-mention>!';
  const twoWordMentionTextRepresentation = 'Hello @Patricia Adams!';
  const twoWordMentionTag: TagData = {
    closingTagIndex: 41,
    content: 'Patricia Adams',
    openTagBody: '<msft-mention id="1">',
    openTagIndex: 6,
    plainTextBeginIndex: 6,
    plainTextEndIndex: 21,
    tagType: 'msft-mention'
  };

  test('Basic parsing works', () => {
    const parsed = textToTagParser(basicMention, '@');

    expect(parsed.plainText).toEqual(basicMentionTextRepresentation);
    expect(parsed.tags).toEqual([basicMentionTag]);
  });

  test('Nested tags parsing and trigger of 2 characters succeeds', () => {
    const parsed = textToTagParser(nestedMention, '#é');
    expect(parsed.plainText).toEqual(nestedMentionTextRepresentation);
    expect(parsed.tags).toEqual(nestedMentionTags);
  });

  test('Bad HTML does not break parsing', () => {
    const badString = '<b>Hello, <i>world!</i>';
    const plainText = 'Hello, world!';
    let parsed: { tags: TagData[]; plainText: string } | undefined;
    expect(() => {
      parsed = textToTagParser(badString, '@');
    }).not.toThrow();
    expect(parsed?.plainText).toEqual(plainText);
  });

  test('Using < in the text does not break parsing', () => {
    const comparisonString = 'x<y and z';
    let parsed: { tags: TagData[]; plainText: string } | undefined;
    expect(() => {
      parsed = textToTagParser(comparisonString, '@');
    }).not.toThrow();
    expect(parsed?.plainText).toEqual(comparisonString);
  });

  test('Using > in the text does not break parsing', () => {
    const comparisonString = 'x>y and z';
    let parsed: { tags: TagData[]; plainText: string } | undefined;
    expect(() => {
      parsed = textToTagParser(comparisonString, '@');
    }).not.toThrow();
    expect(parsed?.plainText).toEqual(comparisonString);
  });

  test('Using /> in the text does not break parsing', () => {
    const comparisonString = 'x/>y and z';
    let parsed: { tags: TagData[]; plainText: string } | undefined;
    expect(() => {
      parsed = textToTagParser(comparisonString, '@');
    }).not.toThrow();
    expect(parsed?.plainText).toEqual(comparisonString);
  });

  test('Basic HTML generation works', () => {
    const htmlString = htmlStringForMentionSuggestion({ id: '1', displayText: 'Everyone' }, localeStrings);
    expect(htmlString).toEqual('<msft-mention id="1">Everyone</msft-mention>');
  });
  test('HTML generation works when the mention has no display text', () => {
    const htmlString = htmlStringForMentionSuggestion({ id: '1', displayText: '' }, localeStrings);
    expect(htmlString).toEqual('<msft-mention id="1">Unnamed participant</msft-mention>');
  });

  test('getDisplayNameForMentionSuggestion returns the correct display name', () => {
    let mention: Mention = {
      id: '1',
      displayText: 'Everyone'
    };
    let displayName = getDisplayNameForMentionSuggestion(mention, localeStrings);
    expect(displayName).toEqual('Everyone');

    mention = {
      id: '1',
      displayText: ''
    };
    displayName = getDisplayNameForMentionSuggestion(mention, localeStrings);
    expect(displayName).toEqual('Unnamed participant');
  });

  test('getValidatedIndexInRange clamps correctly', () => {
    let index = getValidatedIndexInRange({ max: 5, min: 0, currentValue: 10 });
    expect(index).toEqual(5);

    index = getValidatedIndexInRange({ max: 5, min: -3 });
    expect(index).toEqual(-1);

    index = getValidatedIndexInRange({ max: 15, min: 3, currentValue: 10 });
    expect(index).toEqual(10);
  });

  test('findMentionTagForSelection works correctly', () => {
    let tag = findMentionTagForSelection(nestedMentionTags, 23);
    expect(tag).toEqual(undefined);

    tag = findMentionTagForSelection(nestedMentionTags, 14);
    expect(tag).toEqual(nestedMentionTags[0].subTags?.[1]);

    tag = findMentionTagForSelection(nestedMentionTags, 7);
    expect(tag).toEqual(nestedMentionTags[0].subTags?.[1]);

    tag = findMentionTagForSelection(nestedMentionTags, 3);
    expect(tag).toEqual(undefined);
  });

  test('rangeOfWordInSelection works correctly', () => {
    let selection = rangeOfWordInSelection({
      selectionStart: 9,
      textInput: basicMentionTextRepresentation,
      tag: basicMentionTag
    });
    expect(selection).toEqual({ start: 6, end: 15 });
    selection = rangeOfWordInSelection({
      selectionStart: 7,
      selectionEnd: 9,
      textInput: basicMentionTextRepresentation,
      tag: basicMentionTag
    });
    expect(selection).toEqual({ start: 6, end: 15 });

    const { tags, plainText } = textToTagParser(twoWordMention, '@');
    expect(twoWordMentionTextRepresentation).toEqual(plainText);
    expect(twoWordMentionTag).toEqual(tags[0]);

    selection = rangeOfWordInSelection({
      selectionStart: 7,
      selectionEnd: 9,
      textInput: plainText,
      tag: tags[0]
    });
    expect(selection).toEqual({ start: 6, end: 15 });

    selection = rangeOfWordInSelection({
      selectionStart: 7,
      textInput: plainText,
      tag: tags[0]
    });
    expect(selection).toEqual({ start: 6, end: 21 });

    selection = rangeOfWordInSelection({
      selectionStart: 16,
      textInput: plainText,
      tag: tags[0]
    });
    expect(selection).toEqual({ start: 16, end: 21 });

    selection = rangeOfWordInSelection({
      selectionStart: 16,
      selectionEnd: 18,
      textInput: plainText,
      tag: tags[0]
    });
    expect(selection).toEqual({ start: 16, end: 21 });
  });

  test('findNewSelectionIndexForMention works correctly', () => {
    let newSelectionIndex = findNewSelectionIndexForMention({
      tag: twoWordMentionTag,
      textValue: twoWordMentionTextRepresentation,
      currentSelectionIndex: 8,
      previousSelectionIndex: 7
    });
    expect(newSelectionIndex).toEqual(15); // Move to the end of the word

    newSelectionIndex = findNewSelectionIndexForMention({
      tag: twoWordMentionTag,
      textValue: twoWordMentionTextRepresentation,
      currentSelectionIndex: 17,
      previousSelectionIndex: 8
    });
    expect(newSelectionIndex).toEqual(21); // Move to the start of the mention

    newSelectionIndex = findNewSelectionIndexForMention({
      tag: twoWordMentionTag,
      textValue: twoWordMentionTextRepresentation,
      currentSelectionIndex: 6,
      previousSelectionIndex: 8
    });
    expect(newSelectionIndex).toEqual(6); // Move to the start of the word

    // "Hello @Patricia Adams!"
    newSelectionIndex = findNewSelectionIndexForMention({
      tag: twoWordMentionTag,
      textValue: twoWordMentionTextRepresentation,
      currentSelectionIndex: 18,
      previousSelectionIndex: 20
    });
    expect(newSelectionIndex).toEqual(15); // Move to the start of the word
  });

  test('updateHTML works correctly', () => {
    // Basic append
    let updated = updateHTML({
      change: '!',
      htmlText: basicMention,
      mentionTrigger: '@',
      oldPlainText: basicMentionTextRepresentation,
      oldPlainTextEndIndex: 15,
      newPlainText: basicMentionTextRepresentation + '!',
      startIndex: 15,
      tags: [basicMentionTag]
    });
    expect(updated.updatedHTML).toEqual('Hello <msft-mention id="1">everyone</msft-mention>!!');
    expect(updated.updatedSelectionIndex).toEqual(16);

    // Delete just before first word of a mention
    updated = updateHTML({
      change: '',
      htmlText: twoWordMention,
      mentionTrigger: '@',
      oldPlainText: twoWordMentionTextRepresentation,
      oldPlainTextEndIndex: 7,
      newPlainText: 'Hello Patricia Adams!',
      startIndex: 6,
      tags: [twoWordMentionTag]
    });

    expect(updated.updatedHTML).toEqual('Hello <msft-mention id="1">Adams</msft-mention>!');
    expect(updated.updatedSelectionIndex).toEqual(6);

    // Delete just before second word of a mention
    updated = updateHTML({
      change: '',
      htmlText: twoWordMention,
      mentionTrigger: '@',
      oldPlainText: twoWordMentionTextRepresentation,
      oldPlainTextEndIndex: 16,
      newPlainText: 'Hello @PatriciaAdams!',
      startIndex: 15,
      tags: [twoWordMentionTag]
    });

    expect(updated.updatedHTML).toEqual('Hello <msft-mention id="1">Patricia</msft-mention>!');
    expect(updated.updatedSelectionIndex).toEqual(15);

    // Backspace at the end of a mention
    updated = updateHTML({
      change: '',
      htmlText: twoWordMention,
      mentionTrigger: '@',
      oldPlainText: twoWordMentionTextRepresentation,
      oldPlainTextEndIndex: 21,
      newPlainText: 'Hello @Patricia Adam!',
      startIndex: 20,
      tags: [twoWordMentionTag]
    });

    expect(updated.updatedHTML).toEqual('Hello <msft-mention id="1">Patricia</msft-mention>!');
    expect(updated.updatedSelectionIndex).toEqual(15);

    // Backspace in the middle of a mention
    updated = updateHTML({
      change: '',
      htmlText: twoWordMention,
      mentionTrigger: '@',
      oldPlainText: twoWordMentionTextRepresentation,
      oldPlainTextEndIndex: 15,
      newPlainText: 'Hello @Patrici Adams!',
      startIndex: 14,
      tags: [twoWordMentionTag]
    });

    expect(updated.updatedHTML).toEqual('Hello <msft-mention id="1">Adams</msft-mention>!');
    expect(updated.updatedSelectionIndex).toEqual(6);

    // Insertion in the middle of a mention (should cause delete)
    updated = updateHTML({
      change: 'd',
      htmlText: twoWordMention,
      mentionTrigger: '@',
      oldPlainText: twoWordMentionTextRepresentation,
      oldPlainTextEndIndex: 15,
      newPlainText: 'Hello @Patriciad Adams!',
      startIndex: 15,
      tags: [twoWordMentionTag]
    });

    expect(updated.updatedHTML).toEqual('Hello d!');
    expect(updated.updatedSelectionIndex).toEqual(7);
  });

  test('findStringsDiffIndexes works correctly', () => {
    // Backspace into first word of a mention
    let diff = findStringsDiffIndexes({
      currentSelectionEnd: 14,
      currentSelectionStart: 14,
      newText: 'Hello @Patrici Adams!',
      oldText: 'Hello @Patricia Adams!',
      previousSelectionEnd: 15,
      previousSelectionStart: 16
    });

    expect(diff).toEqual({ changeStart: 14, newChangeEnd: 14, oldChangeEnd: 15 });

    // Append to end of the string
    diff = findStringsDiffIndexes({
      currentSelectionEnd: 23,
      currentSelectionStart: 23,
      newText: 'Hello @Patricia Adams!!',
      oldText: 'Hello @Patricia Adams!',
      previousSelectionEnd: 22,
      previousSelectionStart: 22
    });

    expect(diff).toEqual({ changeStart: 22, newChangeEnd: 23, oldChangeEnd: 22 });

    // Insert mid-mention
    diff = findStringsDiffIndexes({
      currentSelectionEnd: 17,
      currentSelectionStart: 17,
      newText: 'Hello @Patricia $Adams!',
      oldText: 'Hello @Patricia Adams!',
      previousSelectionEnd: 16,
      previousSelectionStart: 16
    });

    expect(diff).toEqual({ changeStart: 16, newChangeEnd: 17, oldChangeEnd: 16 });
  });
});
