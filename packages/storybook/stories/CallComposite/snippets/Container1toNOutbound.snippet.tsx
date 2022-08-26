import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CallParticipantsLocator,
  CompositeLocale,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string[];
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const createCallAdapterLocator = (locator: string[]): CallParticipantsLocator | undefined => {
  if (locator && locator.length > 0) {
    // Change to participantIds once api is updated
    return { participantIDs: locator };
  }
  return undefined;
};

export const ContosoCallContainer1toN = (props: ContainerProps): JSX.Element => {
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
        formFactor={props.formFactor}
        fluentTheme={props.fluentTheme}
        callInvitationUrl={props?.callInvitationURL}
        locale={props?.locale}
        options={props?.options}
      />
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing 1:N Preview...</>;
};

const leaveCall = async (adapter: CallAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
