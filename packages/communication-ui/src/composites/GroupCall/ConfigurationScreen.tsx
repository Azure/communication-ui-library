// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../components';
import { connectFuncsToContext, MapToCallConfigurationProps, SetupContainerProps } from '../../consumers';
import { CallConfiguration } from './CallConfiguration';
import { LocalSettings } from '../../components';
import { StartCallButton } from './StartCallButton';

export interface ConfigurationScreenProps extends SetupContainerProps {
  screenWidth: number;
  startCallHandler(): void;
  groupId: string;
}

const ConfigurationComponentBase = (props: ConfigurationScreenProps): JSX.Element => {
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

const ConfigurationComponent = (props: ConfigurationScreenProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ConfigurationComponentBase, props);

export default connectFuncsToContext(ConfigurationComponent, MapToCallConfigurationProps);
