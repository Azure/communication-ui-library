import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  PlaceholderProps
} from '@azure/communication-react';
import React, { useCallback, useState, useEffect } from 'react';

export type ContainerProps = {
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
