// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ControlBarButton } from '@azure/communication-react';
import { Airplane20Filled, VehicleBus20Filled, VehicleShip20Filled } from '@fluentui/react-icons';
import React from 'react';

const iconDict = {
  airplane: <Airplane20Filled key={'airplaneIconKey'} primaryFill="currentColor" />,
  bus: <VehicleBus20Filled key={'busIconKey'} primaryFill="currentColor" />,
  ship: <VehicleShip20Filled key={'shipIconKey'} primaryFill="currentColor" />
};

const ControlBarButtonStory = (args: any): JSX.Element => {
  const icon = iconDict[args.icons];

  return <ControlBarButton {...args} onRenderIcon={() => icon} strings={{ label: args.icons }} labelKey={args.icons} />;
};

export const Default = ControlBarButtonStory.bind({});
