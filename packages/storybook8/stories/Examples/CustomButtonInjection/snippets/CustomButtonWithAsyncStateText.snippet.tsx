import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterLocator,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  CustomCallControlButtonCallback,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { validate as validateUUID } from 'uuid';

/**
 * A simple async function for testing async and await callbacks with custom buttons
 * @param stallTime number in milliseconds, default is 2000ms.
 */
const simpleAsyncCall = async (stallTime = 2000): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, stallTime));
};

export type CallExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean =>
  link.startsWith('https://teams.microsoft.com/meet/') || link.startsWith('https://teams.microsoft.com/l/meetup-join');
const isGroupID = (id: string): boolean => validateUUID(id);

const createCallAdapterLocator = (locator: string): CallAdapterLocator | undefined => {
  if (isTeamsMeetingLink(locator)) {
    return { meetingLink: locator };
  } else if (isGroupID(locator)) {
    return { groupId: locator };
  } else if (/^\d+$/.test(locator)) {
    return { roomId: locator };
  }
  return undefined;
};

export const CustomButtonInjectionWithAsyncStateExample = (props: CallExampleProps): JSX.Element => {
  const [clickSuccessful, setClickSuccessful] = useState(false);
  const [disabledCheck, setDisabledCheck] = useState(false);

  const customButtonsForInjection: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'primary',
      iconName: !clickSuccessful ? 'DefaultCustomButton' : 'NetworkReconnectIcon',
      strings: {
        label: 'Async Custom',
        ariaLabel: 'Custom'
      },
      onItemClick: () => {
        setDisabledCheck(true);
        try {
          simpleAsyncCall().then(() => {
            setDisabledCheck(false);
            setClickSuccessful(!clickSuccessful);
          });
        } catch {
          setDisabledCheck(false);
        }
      },
      disabled: disabledCheck
    })
  ];

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);
  const locator = useMemo(() => createCallAdapterLocator(props.locator), [props.locator]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName, // Max 256 Characters
      credential,
      locator
    },
    undefined,
    leaveCall
  );

  if (!locator) {
    return <>Provided call locator '{props.locator}' is not recognized.</>;
  }

  if (adapter) {
    return (
      <CallComposite
        adapter={adapter}
        options={{
          callControls: {
            raiseHandButton: false,
            screenShareButton: false,
            onFetchCustomButtonProps: customButtonsForInjection
          }
        }}
      />
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

const leaveCall = async (adapter: CallAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
