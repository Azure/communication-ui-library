// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React from 'react';
/* @conditional-compile-remove(together-mode) */
import { _ModalClone } from '.';
/* @conditional-compile-remove(together-mode) */
import {
  ReactionResources,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryTogetherModeParticipantPosition
} from '../types';
/* @conditional-compile-remove(together-mode) */
import { v1 as createGUID } from 'uuid';
/* @conditional-compile-remove(together-mode) */
import { render } from '@testing-library/react';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeOverlay } from './TogetherModeOverlay';

/* @conditional-compile-remove(together-mode) */
jest.mock('@internal/acs-ui-common', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@internal/acs-ui-common')
  };
});

/* @conditional-compile-remove(together-mode) */
describe('together mode overlay tests', () => {
  test('Confirm togetherMode participant Status is not rendered when no participant video stream is available', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: false, renderElement: createVideoDivElement() }
      })
    );

    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions: {}
    };
    const { container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);
    const togetherModeSignalContainers = getTogetherModeSignalContainer(container);
    expect(togetherModeSignalContainers.length).toBe(0);
  });

  test('Confirm togetherMode participant Status is not rendered when participant video stream is available but no seating coordinates', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions: {}
    };
    const { container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);
    const togetherModeSignalContainers = getTogetherModeSignalContainer(container);
    expect(togetherModeSignalContainers.length).toBe(0);
  });

  test('Confirm togetherMode participant Status is  rendered when participant video stream is available and there is seating coordinates', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 10 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition = {
      [localParticipant.userId]: { top: 0, left: 0, width: 0, height: 0 },
      ...Object.fromEntries(
        remoteParticipants.map((participant, index) => [
          participant.userId,
          { top: index * 10, left: index * 10, width: 100, height: 100 }
        ])
      )
    };
    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions
    };
    const { container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);
    const togetherModeSignalContainers = getTogetherModeSignalContainer(container);
    expect(togetherModeSignalContainers.length).toBe(11);
  });

  test('Confirm displayName is rendered when hand is raised', () => {
    //   const raisedHand: RaisedHand = {
    //     raisedHandOrderPosition: 1
    //   };
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 1 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition = {
      [localParticipant.userId]: { top: 0, left: 0, width: 0, height: 0 },
      ...Object.fromEntries(
        remoteParticipants.map((participant, index) => [
          participant.userId,
          { top: index * 10, left: index * 10, width: 100, height: 100 }
        ])
      )
    };
    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions
    };
    const { container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);
    const togetherModeSignalContainers = getTogetherModeSignalContainer(container);
    expect(togetherModeSignalContainers.length).toBe(2);
  });

  test('Confirm displayName is rendered when participants perform reactions', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 1 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition = {
      [localParticipant.userId]: { top: 0, left: 0, width: 0, height: 0 },
      ...Object.fromEntries(
        remoteParticipants.map((participant, index) => [
          participant.userId,
          { top: index * 10, left: index * 10, width: 100, height: 100 }
        ])
      )
    };
    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions
    };
    const { rerender, container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);

    let renderedReactions = getTogetherModeReactions(container);
    expect(renderedReactions.length).toBe(0);

    const updatedLocalParticipant = {
      ...localParticipant,
      reaction: { reactionType: '👍', receivedOn: new Date() }
    };

    const updatedRemoteParticipants = remoteParticipants.map((participant) => ({
      ...participant,
      reaction: { reactionType: '❤️', receivedOn: new Date() }
    }));

    rerender(
      <TogetherModeOverlay
        {...togetherModeOverLayProps}
        localParticipant={updatedLocalParticipant}
        remoteParticipants={updatedRemoteParticipants}
        reactionResources={[{ likeReaction: '', heartReaction: '' }] as ReactionResources}
      />
    );
    renderedReactions = getTogetherModeReactions(container);
    expect(renderedReactions.length).toBe(2);
  });

  test('Confirm displayName is rendered when participants hands are raised', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 1 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const participantsDisplayNames = [localParticipant.displayName, remoteParticipants[0]?.displayName ?? ''];

    const togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition = {
      [localParticipant.userId]: { top: 0, left: 0, width: 0, height: 0 },
      ...Object.fromEntries(
        remoteParticipants.map((participant, index) => [
          participant.userId,
          { top: index * 10, left: index * 10, width: 100, height: 100 }
        ])
      )
    };
    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions
    };
    const { rerender, container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);

    let renderedDisplayNames = getParticipantDisplayName(container);
    expect(renderedDisplayNames.length).toBe(0);

    const updatedLocalParticipant = {
      ...localParticipant,
      spotlight: { spotlightedOrderPosition: 1 }
    };

    const updatedRemoteParticipants = remoteParticipants.map((participant, index) => ({
      ...participant,
      spotlight: { spotlightedOrderPosition: index + 1 }
    }));

    rerender(
      <TogetherModeOverlay
        {...togetherModeOverLayProps}
        localParticipant={updatedLocalParticipant}
        remoteParticipants={updatedRemoteParticipants}
      />
    );
    renderedDisplayNames = getParticipantDisplayName(container);
    expect(renderedDisplayNames.length).toBe(2);
    expect(renderedDisplayNames.sort()).toEqual(participantsDisplayNames.sort());
  });

  test('Confirm displayName is rendered when participants are spotlighted', () => {
    const localParticipant = createLocalParticipant({
      videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
    });
    const remoteParticipants = Array.from({ length: 1 }, (_, index) =>
      createRemoteParticipant({
        userId: `remoteParticipant-${index + 1}`,
        displayName: `Remote Participant ${index + 1}`,
        videoStream: { isAvailable: true, renderElement: createVideoDivElement() }
      })
    );

    const participantsDisplayNames = [localParticipant.displayName, remoteParticipants[0]?.displayName ?? ''];

    const togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition = {
      [localParticipant.userId]: { top: 0, left: 0, width: 0, height: 0 },
      ...Object.fromEntries(
        remoteParticipants.map((participant, index) => [
          participant.userId,
          { top: index * 10, left: index * 10, width: 100, height: 100 }
        ])
      )
    };
    const togetherModeOverLayProps = {
      emojiSize: 16,
      reactionResources: [] as ReactionResources,
      localParticipant,
      remoteParticipants,
      togetherModeSeatPositions
    };
    const { rerender, container } = render(<TogetherModeOverlay {...togetherModeOverLayProps} />);

    let renderedDisplayNames = getParticipantDisplayName(container);
    expect(renderedDisplayNames.length).toBe(0);

    const updatedLocalParticipant = {
      ...localParticipant,
      spotlight: { spotlightedOrderPosition: 1 }
    };

    const updatedRemoteParticipants = remoteParticipants.map((participant, index) => ({
      ...participant,
      spotlight: { spotlightedOrderPosition: index + 1 }
    }));

    rerender(
      <TogetherModeOverlay
        {...togetherModeOverLayProps}
        localParticipant={updatedLocalParticipant}
        remoteParticipants={updatedRemoteParticipants}
      />
    );
    renderedDisplayNames = getParticipantDisplayName(container);
    expect(renderedDisplayNames.length).toBe(2);
    expect(renderedDisplayNames.sort()).toEqual(participantsDisplayNames.sort());
  });
});

/* @conditional-compile-remove(together-mode) */
const getTogetherModeSignalContainer = (root: Element | null): Element[] =>
  Array.from(root?.querySelectorAll('[data-ui-group="together-mode-participant"]') ?? []);

/* @conditional-compile-remove(together-mode) */
const getTogetherModeReactions = (root: Element | null): Element[] =>
  Array.from(root?.querySelectorAll('[data-ui-group="together-mode-participant-reaction"]') ?? []);

/* @conditional-compile-remove(together-mode) */
const getParticipantDisplayName = (root: Element | null): string[] => {
  const participantSignalingStatus = getTogetherModeSignalContainer(root);
  const renderedDisplayNames: string[] = [];

  participantSignalingStatus?.forEach((status) => {
    const span = status.querySelector('span'); // Get the first span inside the div
    if (span) {
      if (span.textContent) {
        renderedDisplayNames.push(span.textContent.trim()); // Store the span text
      }
    }
  });

  return renderedDisplayNames;
};

/* @conditional-compile-remove(together-mode) */
const createLocalParticipant = (attrs?: Partial<VideoGalleryLocalParticipant>): VideoGalleryLocalParticipant => {
  return {
    userId: attrs?.userId ?? 'localParticipant',
    isMuted: attrs?.isMuted ?? false,
    displayName: attrs?.displayName ?? 'Local Participant',
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false,
    raisedHand: attrs?.raisedHand ?? undefined,
    videoStream: {
      id: attrs?.videoStream?.id ?? Math.random(),
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? true,
      isMirrored: attrs?.videoStream?.isMirrored ?? false,
      renderElement: attrs?.videoStream?.renderElement ?? undefined
    }
  };
};

/* @conditional-compile-remove(together-mode) */
const createVideoDivElement = (): HTMLDivElement => {
  const divElement = document.createElement('div');
  divElement.innerHTML = '<video></video>';
  return divElement;
};

/* @conditional-compile-remove(together-mode) */
const createRemoteParticipant = (attrs?: Partial<VideoGalleryRemoteParticipant>): VideoGalleryRemoteParticipant => {
  return {
    userId: attrs?.userId ?? `remoteParticipant-${createGUID()}`,
    displayName: attrs?.displayName ?? 'Remote Participant',
    isMuted: attrs?.isMuted ?? false,
    isSpeaking: attrs?.isSpeaking ?? false,
    /* @conditional-compile-remove(demo) */ state: attrs?.state ?? 'Connected',
    raisedHand: attrs?.raisedHand ?? undefined,
    screenShareStream: {
      id: attrs?.screenShareStream?.id ?? 1,
      isAvailable: attrs?.screenShareStream?.isAvailable ?? false,
      isReceiving: attrs?.screenShareStream?.isReceiving ?? true,
      isMirrored: attrs?.screenShareStream?.isMirrored ?? false,
      renderElement: attrs?.screenShareStream?.renderElement ?? undefined
    },
    videoStream: {
      id: attrs?.videoStream?.id ?? 1,
      isAvailable: attrs?.videoStream?.isAvailable ?? false,
      isReceiving: attrs?.videoStream?.isReceiving ?? true,
      isMirrored: attrs?.videoStream?.isMirrored ?? false,
      renderElement: attrs?.videoStream?.renderElement ?? undefined,
      scalingMode: attrs?.videoStream?.scalingMode ?? 'Crop'
    },
    isScreenSharingOn: attrs?.isScreenSharingOn ?? false
  };
};
