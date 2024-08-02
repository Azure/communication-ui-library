import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  alternateCallerId: string;
  userId: CommunicationUserIdentifier;
  token: string;
  targetCallees: string;
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const createTargetCallees = (callees: string): PhoneNumberIdentifier[] => {
  const numbers = callees.split(',');
  const targetCallees = numbers.map((c) => fromFlatCommunicationIdentifier(c) as PhoneNumberIdentifier);
  console.log('targetCallees', targetCallees);
  return targetCallees;
};

export const ContosoCallContainerPSTN = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const targetCallees = useMemo(() => createTargetCallees(props.targetCallees), [props.targetCallees]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName, // Max 256 Characters
      credential,
      targetCallees,
      alternateCallerId: props.alternateCallerId
    },
    undefined,
    leaveCall
  );

  if (!targetCallees) {
    return <>Please provide the identities of people you would like to call</>;
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
