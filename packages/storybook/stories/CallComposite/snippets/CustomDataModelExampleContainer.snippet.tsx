import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  PlaceholderProps
} from '@azure/communication-react';
import React, { useCallback, useState, useEffect } from 'react';

export type ContainerProps = {
  endpointUrl: string;
  token: string;
  groupId: string;
  displayName: string;
  avatarInitials: string;
};

export const CustomDataModelExampleContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (props.token && props.groupId) {
      const groupLocator = {
        groupId: props.groupId
      };
      const createAdapter = async (): Promise<void> => {
        setAdapter(await createAzureCommunicationCallAdapter(props.token, groupLocator, props.displayName));
      };
      createAdapter();
    }
  }, [props]);

  // FIXME: There is still a small chance of adapter leak:
  // - props change triggers the `useEffect` block that queues async adapter creation
  // - Component unmounts, the following `useEffect` clean up runs but finds an undefined adapter
  // - async adapter creation succeeds -- adapter is created, and leaked.
  //
  // In this scenario, the adapter is never used to join a call etc. but there is still a memory leak.
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

  return <>{adapter && <CallComposite adapter={adapter} onRenderAvatar={onRenderAvatar} />}</>;
};
