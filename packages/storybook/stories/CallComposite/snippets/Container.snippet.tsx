import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterLocator,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme, initializeIcons } from '@fluentui/react';
import React, { useMemo } from 'react';
import { validate as validateUUID } from 'uuid';

initializeIcons();

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
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

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
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
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          rtl={props.rtl}
          callInvitationUrl={props?.callInvitationURL}
          locale={props?.locale}
          options={props?.options}
        />
      </div>
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
