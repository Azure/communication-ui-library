import { DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { Stack, TextField } from '@fluentui/react';
import React, { useState } from 'react';

export const ComponentIcons = (): JSX.Element => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  const icons = () => {
    const allIconKeys = Object.keys(DEFAULT_COMPONENT_ICONS);
    const filteredKeys = searchText
      ? allIconKeys.filter((k) => k.toLowerCase().includes(searchText.toLowerCase()))
      : allIconKeys;
    return filteredKeys.map((key) => {
      return (
        <Stack
          horizontal
          style={{
            padding: '0.5rem 0'
          }}
        >
          <Stack horizontalAlign="start">{DEFAULT_COMPONENT_ICONS[key]}</Stack>
          <Stack
            horizontalAlign="start"
            style={{
              paddingLeft: '0.5rem',
              fontSize: '0.75rem'
            }}
          >
            {key}
          </Stack>
        </Stack>
      );
    });
  };

  const searchIcons = () => {
    return (
      <Stack style={{ padding: '1rem 0' }} horizontalAlign="start">
        <TextField
          label="Search Icons:"
          underlined
          onChange={(e, val) => {
            setSearchText(val);
          }}
        />
      </Stack>
    );
  };

  return (
    <Stack>
      {searchIcons()}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', padding: '1rem 0' }}>{icons()}</div>
    </Stack>
  );
};
