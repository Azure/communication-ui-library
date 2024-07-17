import { FluentThemeProvider, ControlBarButton } from '@azure/communication-react';
import { Airplane20Filled, VehicleShip20Filled } from '@fluentui/react-icons';
import React from 'react';

export const ControlBarButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBarButton
        key={'btn1'}
        onRenderIcon={() => <Airplane20Filled key={'airplaneIconKey'} primaryFill="currentColor" />}
        strings={{ label: 'airplane' }}
        labelKey={'airplaneButtonLabel'}
        showLabel={true}
      />
      <ControlBarButton
        key={'btn1'}
        onRenderIcon={() => <VehicleShip20Filled key={'shipIconKey'} primaryFill="currentColor" />}
        strings={{ label: 'ship' }}
        labelKey={'shipButtonLabel'}
        showLabel={true}
      />
    </FluentThemeProvider>
  );
};
