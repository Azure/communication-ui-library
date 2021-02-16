// © Microsoft Corporation. All rights reserved.
import { ChatThreadMember } from '@azure/communication-chat';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import React from 'react';
import TypingIndicator from './TypingIndicator';

let mockCurrentUserId = '';
let mockThreadMembers: ChatThreadMember[] = [];
let mockTypingUsers: ChatThreadMember[] = [];

jest.mock('../providers/ChatProvider', () => {
  return {
    useUserId: () => mockCurrentUserId
  };
});

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useThreadMembers: jest.fn().mockImplementation((): ChatThreadMember[] => {
      return mockThreadMembers;
    })
  };
});

jest.mock('../hooks/useTypingUsers', () => {
  return {
    useTypingUsers: jest.fn().mockImplementation((): ChatThreadMember[] => {
      return mockTypingUsers;
    })
  };
});

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container !== null) {
    unmountComponentAtNode(container);
    container.remove();
  }
});

const getElementsFromContainer = (container: HTMLDivElement): Element[] => {
  const parent: HTMLCollection = container?.children;
  expect(parent?.length === 1).toBe(true);
  const collection = parent?.[0]?.children;
  expect(collection).toBeTruthy();
  return Array.from(collection);
};

const buildSetFromElements = (elements: Element[]): Set<string | null> => {
  return new Set(elements.filter((element) => !!element?.textContent).map((element) => element.textContent));
};

/* TODO: We should revisit fixing the TypingIndicator customization tests once we have a new design on how user can
   * provide customization to the data layer.
const buildUrlsSetFromElements = (elements: Element[]): Set<string | null> => {
  return new Set(
    elements
      .filter((element) => element?.tagName.toUpperCase() === 'img'.toUpperCase())
      .map((element) => (element as HTMLImageElement).src)
  );
};
*/

describe('TypingIndicator tests', () => {
  const currentUserId = 'test_user_id_1';
  const userIdTwo = 'test_user_id_2';
  const userIdThree = 'test_user_id_3';
  const userIdFour = 'test_user_id_4';
  const currentUserDisplayName = 'User One';
  const userTwoDisplayName = 'User Two';
  const userThreeDisplayName = 'User Three';
  const userFourDisplayName = 'User Four';
  const userTwoLongDisplayName = 'User Twooooooooooooo';
  const userThreeLongDisplayName = 'User Threeeeeeeeeeee';
  /* TODO: We should revisit fixing the TypingIndicator customization tests once we have a new design on how user can
   * provide customization to the data layer.
  const userTwoCustomDisplayName = 'Custom User Two';
  const userTwoCustomPrefixImage = 'https://customusertwo/';
  */
  const isTypingLabel = ' is typing...';
  const areTypingLabel = ' are typing...';
  const othersLabel = ' and 1 other';
  const participantsLabel = '2 participants';
  /* TODO: We should revisit fixing the TypingIndicator customization tests once we have a new design on how user can
   * provide customization to the data layer.
  const othersLabelCustom = ' including ?? more';
  const othersLabelCustomRendered = ' including 1 more';
  const participantsLabelCustom = '?? members';
  const participantsLabelCustomRendered = '2 members';
  const isTypingLabelCustom = ' is composing a message...';
  const areTypingLabelCustom = ' are composing messages...';
  */

  test('TypingIndicator displays nothing when no users are typing', () => {
    mockThreadMembers = [];
    mockTypingUsers = [];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 1);
    expect(elements[0].textContent === null || elements[0].textContent.length === 0).toBe(true);
  });

  test('TypingIndicator displays nothing when the current and typing user is the same', () => {
    mockThreadMembers = [{ displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } }];
    mockTypingUsers = [{ displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } }];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 1);
    expect(elements[0].textContent === null || elements[0].textContent.length === 0).toBe(true);
  });

  test('TypingIndicator displays other users display name when other user is typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }
    ];
    mockTypingUsers = [{ displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 2);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName)).toBe(true);
    expect(set.has(isTypingLabel)).toBe(true);
  });

  test('TypingIndicator displays two users display names when other two users are typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockTypingUsers = [
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 3);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName + ', ')).toBe(true);
    expect(set.has(userThreeDisplayName)).toBe(true);
    expect(set.has(areTypingLabel)).toBe(true);
  });

  test('TypingIndicator displays two users with other users string when more than two other users are typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } },
      { displayName: userFourDisplayName, user: { communicationUserId: userIdFour } }
    ];
    mockTypingUsers = [
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } },
      { displayName: userFourDisplayName, user: { communicationUserId: userIdFour } }
    ];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 4);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName + ', ')).toBe(true);
    expect(set.has(userThreeDisplayName)).toBe(true);
    expect(set.has(othersLabel + areTypingLabel)).toBe(true);
  });

  test('TypingIndicator displays participants string when user display names are over 35 characters', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoLongDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeLongDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockTypingUsers = [
      { displayName: userTwoLongDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeLongDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockCurrentUserId = currentUserId;
    act(() => {
      render(<TypingIndicator />, container);
    });
    const elements = getElementsFromContainer(container);
    expect(elements.length === 2);
    const set = buildSetFromElements(elements);
    expect(set.has(participantsLabel + areTypingLabel)).toBe(true);
  });

  /*
  TODO: Below are TypingIndicator customization tests. Currently we removed those customizations from the component due
  to requiring it at the data layer. We need some discussion on how to design the ability to provide customization from
  user to the data layer.

  test('TypingIndicator displays custom display name when generator is passed in and provides it', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }
    ];
    mockTypingUsers = [{ displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }];
    mockCurrentUserId = currentUserId;

    const mockGenerator = (user: ChatThreadMember): TypingUserData => {
      if (user.displayName === userTwoDisplayName) {
        return {
          prefixImageUrl: '',
          displayName: userTwoCustomDisplayName
        };
      } else {
        return {
          prefixImageUrl: '',
          displayName: user.displayName === undefined ? '' : user.displayName
        };
      }
    };

    act(() => {
      render(<TypingIndicator displayInfoGenerator={mockGenerator} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 2);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoCustomDisplayName)).toBe(true);
    expect(set.has(isTypingLabel)).toBe(true);
  });

  test('TypingIndicator displays return custom prefix image when generator is passed in and provides it', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }
    ];
    mockTypingUsers = [{ displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }];
    mockCurrentUserId = currentUserId;

    const mockGenerator = (user: ChatThreadMember): TypingUserData => {
      if (user.displayName === userTwoDisplayName) {
        return {
          prefixImageUrl: userTwoCustomPrefixImage,
          displayName: userTwoCustomDisplayName
        };
      } else {
        return {
          prefixImageUrl: '',
          displayName: user.displayName === undefined ? '' : user.displayName
        };
      }
    };

    act(() => {
      render(<TypingIndicator displayInfoGenerator={mockGenerator} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 3);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoCustomDisplayName)).toBe(true);
    expect(set.has(isTypingLabel)).toBe(true);
    const setUrls = buildUrlsSetFromElements(elements);
    expect(setUrls.has(userTwoCustomPrefixImage)).toBe(true);
  });

  test('TypingIndicator displays custom others label when defined and more than two users are typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } },
      { displayName: userFourDisplayName, user: { communicationUserId: userIdFour } }
    ];
    mockTypingUsers = [
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } },
      { displayName: userFourDisplayName, user: { communicationUserId: userIdFour } }
    ];
    mockCurrentUserId = currentUserId;

    act(() => {
      render(<TypingIndicator othersLabel={othersLabelCustom} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 4);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName + ', ')).toBe(true);
    expect(set.has(userThreeDisplayName)).toBe(true);
    expect(set.has(othersLabelCustomRendered)).toBe(true);
    expect(set.has(areTypingLabel));
  });

  test('TypingIndicator displays custom participants label when defined two users display names are over 35 characters', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoLongDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeLongDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockTypingUsers = [
      { displayName: userTwoLongDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeLongDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockCurrentUserId = currentUserId;

    act(() => {
      render(<TypingIndicator participantsLabel={participantsLabelCustom} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 2);
    const set = buildSetFromElements(elements);
    expect(set.has(participantsLabelCustomRendered)).toBe(true);
    expect(set.has(areTypingLabel));
  });

  test('TypingIndicator displays custom isTyping label when defined and one user is typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }
    ];
    mockTypingUsers = [{ displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } }];
    mockCurrentUserId = currentUserId;

    act(() => {
      render(<TypingIndicator isTypingLabel={isTypingLabelCustom} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 2);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName)).toBe(true);
    expect(set.has(isTypingLabelCustom));
  });

  test('TypingIndicator displays custom areTyping label when defined and more than one user is typing', () => {
    mockThreadMembers = [
      { displayName: currentUserDisplayName, user: { communicationUserId: currentUserId } },
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockTypingUsers = [
      { displayName: userTwoDisplayName, user: { communicationUserId: userIdTwo } },
      { displayName: userThreeDisplayName, user: { communicationUserId: userIdThree } }
    ];
    mockCurrentUserId = currentUserId;

    act(() => {
      render(<TypingIndicator areTypingLabel={areTypingLabelCustom} />, container);
    });

    const elements = getElementsFromContainer(container);
    expect(elements.length === 3);
    const set = buildSetFromElements(elements);
    expect(set.has(userTwoDisplayName + ', ')).toBe(true);
    expect(set.has(userThreeDisplayName)).toBe(true);
    expect(set.has(areTypingLabelCustom));
  });
  */
});
