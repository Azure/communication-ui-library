import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  PlaceholderProps
} from '@azure/communication-react';
import React, { useCallback, useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  groupId: string;
  displayName: string;
  avatarInitials: string;
  callInvitationURL?: string;
};

export const CustomDataModelExampleContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (props.token && props.groupId) {
      const groupLocator = {
        groupId: props.groupId
      };
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationCallAdapter(
            { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
            props.displayName,
            new AzureCommunicationTokenCredential(props.token),
            groupLocator
          )
        );
      };
      createAdapter();
    }
  }, [props]);

  useEffect(() => {
    return () => {
      (async () => {
        if (!adapter) {
          return;
        }
        await adapter.leaveCall().catch((e) => {
          console.error('Failed to leave call', e);
        });
        adapter.dispose();
      })();
    };
  }, [adapter]);

  const onRenderAvatar = useCallback(
    (onRenderAvatarprops: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element): JSX.Element => {
      onRenderAvatarprops.displayName = `${props.avatarInitials}`;
      return defaultOnRender(onRenderAvatarprops);
    },
    [props.avatarInitials]
  );

  return (
    <>
      {adapter && (
        <CallComposite adapter={adapter} onRenderAvatar={onRenderAvatar} callInvitationURL={props?.callInvitationURL} />
      )}
    </>
  );
};
