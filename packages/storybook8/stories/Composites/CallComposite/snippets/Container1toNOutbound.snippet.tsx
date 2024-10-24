import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
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
  userId: CommunicationUserIdentifier;
  token: string;
  targetCallees: string[];
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const createTargetCallees = (targetCallees: string[]): CommunicationUserIdentifier[] => {
  return targetCallees.map((c) => fromFlatCommunicationIdentifier(c) as CommunicationUserIdentifier);
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

  const targetCallees = useMemo(() => createTargetCallees(props.targetCallees), [props.targetCallees]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName, // Max 256 Characters
      credential,
      targetCallees
    },
    undefined,
    leaveCall
  );

  if (!targetCallees) {
    return <>Please provide the identities of people you would like to call</>;
  }

  if (adapter) {
    return (
      <CallComposite
        adapter={adapter}
        formFactor={props.formFactor}
        fluentTheme={props.fluentTheme}
        rtl={props.rtl}
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
