// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const exampleDisableCaptions = `
const options: CallCompositeOptions = {
    callControls: {
      captionsButton: false
    }
  };
`;

export const exampleStartCaptionsBackgroundNoUI = `
const captionsStarted = useRef(false);
const afterAdapterCreate = useCallback(
    async (adapter: CallWithChatAdapter): Promise<CallWithChatAdapter> => {
      adapter.onStateChange((state: CallWithChatAdapterState) => {
        if (state.call?.state === 'Connected' && !captionsStarted.current) {
          adapter.startCaptions({ startInBackground: true, spokenLanguage: 'en-us' });
          captionsStarted.current = true;
        }
      });
      adapter.on('captionsReceived', (captions) => {
        console.log('captionsReceived', captions);
      });
      return adapter;
    },
    [captionsStarted]
  );
`;

export const exampleStartCaptionsBackgroundShowUI = `
const captionsStarted = useRef(false);
const afterAdapterCreate = useCallback(
    async (adapter: CallWithChatAdapter): Promise<CallWithChatAdapter> => {
      adapter.onStateChange((state: CallWithChatAdapterState) => {
        if (state.call?.state === 'Connected' && !captionsStarted.current) {
          adapter.startCaptions();
          captionsStarted.current = true;
        }
      });
      return adapter;
    },
    [captionsStarted]
  );
`;
