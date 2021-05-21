import {
  PlaceholderProps,
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter
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

  const onRenderAvatar = useCallback(
    (onRenderAvatarprops: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element): JSX.Element => {
      onRenderAvatarprops.displayName = `${props.avatarInitials}`;
      return defaultOnRender(onRenderAvatarprops);
    },
    [props.avatarInitials]
  );

  return <>{adapter && <CallComposite adapter={adapter} onRenderAvatar={onRenderAvatar} />}</>;
};
