import { FluentThemeProvider, useTheme } from '@azure/communication-react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import React from 'react';

export interface DeviceSettingsProps {
  devices: string[];
  onChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => void;
}

export const DeviceSettingDropdownExample = ({ devices, onChange }: DeviceSettingsProps): JSX.Element => {
  const theme = useTheme();

  return (
    <FluentThemeProvider fluentTheme={theme}>
      <Dropdown
        style={{ width: '15em', overflow: 'hidden' }}
        placeholder="Select an option"
        onChange={onChange}
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
