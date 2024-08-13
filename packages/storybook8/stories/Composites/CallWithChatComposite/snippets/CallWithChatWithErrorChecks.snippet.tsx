import { TeamsMeetingLinkLocator, TeamsMeetingIdLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallWithChatComposite,
  useAzureCommunicationCallWithChatAdapter,
  CallWithChatCompositeOptions,
  CallWithChatAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme, Spinner } from '@fluentui/react';
import React, { useMemo } from 'react';

export type CallWithChatExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: TeamsMeetingLinkLocator | CallAndChatLocator | TeamsMeetingIdLocator;
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  compositeOptions?: CallWithChatCompositeOptions;
  callInvitationURL?: string;
  formFactor?: 'desktop' | 'mobile';
};

export const CallWithChatExperienceWithErrorChecks = (props: CallWithChatExampleProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch (e) {
      return undefined;
    }
  }, [props.token]);

  const adapter = useAzureCommunicationCallWithChatAdapter(
    {
      userId: props.userId,
      displayName: props.displayName,
      credential,
      locator: props.locator,
      endpoint: props.endpointUrl
    },
    undefined,
    leaveCall
  );

  if (!credential) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  if (!adapter) {
    return <Spinner label="Initializing..." />;
  }

  return (
    <CallWithChatComposite
      adapter={adapter}
      fluentTheme={props.fluentTheme}
      rtl={props.rtl}
      formFactor={props.formFactor}
      joinInvitationURL={props.callInvitationURL}
      options={props.compositeOptions}
    />
  );
};

const leaveCall = async (adapter: CallWithChatAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
