// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { LocalSettings, CallConfiguration, StartCallButton } from '../../components';
import { connectFuncsToContext, MapToCallConfigurationProps, SetupContainerProps } from '../../consumers';

export interface ConfigurationScreenProps extends SetupContainerProps {
  screenWidth: number;
  startCallHandler(): void;
  groupId: string;
}

export const ConfigurationComponent = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, joinCall, groupId } = props;

  return (
    <CallConfiguration {...props}>
      <div>
        <LocalSettings />
      </div>
      <div>
        <StartCallButton
          onClickHandler={() => {
            startCallHandler();
            joinCall(groupId);
          }}
          isDisabled={false}
        />
      </div>
    </CallConfiguration>
  );
};

export default connectFuncsToContext(ConfigurationComponent, MapToCallConfigurationProps);
