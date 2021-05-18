import { FluentThemeProvider } from '@azure/communication-react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';

export interface DeviceSettingsProps {
  devices: string[];
  onChanged: (option: IDropdownOption, index?: number) => void;
}

export const DeviceSettingDropdownExample = ({ devices, onChanged }: DeviceSettingsProps): JSX.Element => {
  const theme = useTheme();

  return (
    <FluentThemeProvider fluentTheme={theme}>
      <Dropdown
        style={{ width: '15rem' }}
        placeholder="Select an option"
        onChanged={onChanged}
        options={devices.map((device) => {
          return {
            selected: false,
            key: device,
            text: device
          };
        })}
      />
    </FluentThemeProvider>
  );
};
