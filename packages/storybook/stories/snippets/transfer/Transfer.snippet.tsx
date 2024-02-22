import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsAppIdentifier
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
import React, { useCallback, useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
  // Teams user ids need to be in format '28:orgid:<UUID>'. For example, '28:orgid:87d349ed-44d7-43e1-9a83-5f2406dee5bd'
  microsoftTeamsAppId: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [transferredCallIds, setTransferredCallIds] = useState<string[]>([]);
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const callAdapterArgs = useMemo(
    () => ({
      userId: props.userId,
      credential,
      targetCallees: [fromFlatCommunicationIdentifier(props.microsoftTeamsAppId)] as MicrosoftTeamsAppIdentifier[]
    }),
    [props.userId, credential, props.microsoftTeamsAppId]
  );

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      adapter.on('transferAccepted', (transferArgs) => {
        const oldIds = transferredCallIds;
        setTransferredCallIds(oldIds.concat([transferArgs.targetCall.id]));
      });
      return adapter;
    },
    [transferredCallIds]
  );

  const leaveCall = async (adapter: CallAdapter): Promise<void> => {
    await adapter.leaveCall().catch((e) => {
      console.error('Failed to leave call', e);
    });
    /**
     * Following the end of the call
     */
    console.log('these are the calls you were transferred to: ', transferredCallIds);
  };

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs, afterCallAdapterCreate, leaveCall);

  if (!props.microsoftTeamsAppId) {
    return <>Microsoft Teams App id is not provided.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
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
