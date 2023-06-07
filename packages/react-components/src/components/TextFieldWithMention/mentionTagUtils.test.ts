// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// import React from 'react';

/* @conditional-compile-remove(mention) */
import { Mention } from '../MentionPopover';
/* @conditional-compile-remove(mention) */
import {
  TagData,
  findMentionTagForSelection,
  getDisplayNameForMentionSuggestion,
  getValidatedIndexInRange,
  htmlStringForMentionSuggestion,
  rangeOfWordInSelection,
  textToTagParser
} from './mentionTagUtils';
/* @conditional-compile-remove(mention) */
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';

const localeStrings = COMPONENT_LOCALE_EN_US.strings;
const basicMention = 'Hello <msft-mention id="1" displayText="Everyone">everyone</msft-mention>!';
const basicMentionTextRepresentation = 'Hello @everyone!';
const basicMentionTag: TagData = {
  closingTagIndex: 58,
  content: 'everyone',
  openTagBody: '<msft-mention id="1" displayText="Everyone">',
  openTagIndex: 6,
  plainTextBeginIndex: 6,
  plainTextEndIndex: 15,
  tagType: 'msft-mention'
};
const nestedMention =
  '<p><b>Hello</b> <msft-mention id="1" displayText="Everyone">everyone</msft-mention></p><em>!</em>';
const nestedMentionTextRepresentation = 'Hello #éeveryone!';
const nestedMentionTags: TagData[] = [
  {
    closingTagIndex: 83,
    content: '<b>Hello</b> <msft-mention id="1" displayText="Everyone">everyone</msft-mention>',
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
        closingTagIndex: 65,
        content: 'everyone',
        openTagBody: '<msft-mention id="1" displayText="Everyone">',
        openTagIndex: 13,
        plainTextBeginIndex: 6,
        plainTextEndIndex: 16,
        tagType: 'msft-mention'
      }
    ],
    tagType: 'p'
  },
  {
    closingTagIndex: 92,
    content: '!',
    openTagBody: '<em>',
    openTagIndex: 87,
    plainTextBeginIndex: 16,
    plainTextEndIndex: 17,
    tagType: 'em'
  }
];
/* @conditional-compile-remove(mention) */
describe('Mention logic should be robust and accurate', () => {
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
});

/* @conditional-compile-remove(mention) */
describe('Mention HTML generation is correct', () => {
  test('Basic HTML generation works', () => {
    const htmlString = htmlStringForMentionSuggestion({ id: '1', displayText: 'Everyone' }, localeStrings);
    expect(htmlString).toEqual('<msft-mention id ="1" displayText ="Everyone">Everyone</msft-mention>');
  });
  test('HTML generation works when the mention has no display text', () => {
    const htmlString = htmlStringForMentionSuggestion({ id: '1', displayText: '' }, localeStrings);
    expect(htmlString).toEqual('<msft-mention id ="1" displayText ="">Unnamed participant</msft-mention>');
  });
});

/* @conditional-compile-remove(mention) */
describe('Mention helpers function correctly', () => {
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

    const twoWordMention = 'Hello <msft-mention id="1" displayText="Patricia Adams">Patricia Adams</msft-mention>!';
    const { tags, plainText } = textToTagParser(twoWordMention, '@');

    const twoWordMentionTextRepresentation = 'Hello @Patricia Adams!';
    const twoWordMentionTag: TagData = {
      closingTagIndex: 70,
      content: 'Patricia Adams',
      openTagBody: '<msft-mention id="1" displayText="Patricia Adams">',
      openTagIndex: 6,
      plainTextBeginIndex: 6,
      plainTextEndIndex: 21,
      tagType: 'msft-mention'
    };
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
});
