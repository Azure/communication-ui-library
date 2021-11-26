// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, Stack, TextField } from '@fluentui/react';
import React, { useState } from 'react';

const iconGrid = (allIcons: Record<string, JSX.Element>, searchText?: string): JSX.Element[] => {
  const allIconKeys = Object.keys(allIcons);
  const filteredKeys = searchText
    ? allIconKeys.filter((k) => k.toLowerCase().includes(searchText.toLowerCase()))
    : allIconKeys;

  return filteredKeys.map((key, idx) => {
    return (
      <Stack
        key={idx}
        horizontal
        style={{
          padding: '0.5rem 0'
        }}
      >
        <Stack horizontalAlign="start" className={mergeStyles({ span: { fontSize: '1rem' } })}>
          {allIcons[key]}
        </Stack>
        <Stack
          horizontalAlign="start"
          style={{
            paddingLeft: '0.5rem',
            fontSize: '0.75rem',
            fontFamily: 'consolas'
          }}
        >
          {key}
        </Stack>
      </Stack>
    );
  });
};

const SearchBar = (props: { onChange: (newValue?: string) => void }): JSX.Element => {
  const { onChange } = props;
  return (
    <Stack style={{ padding: '1rem 0' }} horizontalAlign="start">
      <TextField
        label="Search Icons:"
        underlined
        onChange={(e, val) => {
          onChange(val);
        }}
      />
    </Stack>
  );
};

export const IconGridWithSearch = (props: { icons: Record<string, JSX.Element> }): JSX.Element => {
  const { icons } = props;
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  return (
    <Stack>
      <SearchBar onChange={(val) => setSearchText(val)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', padding: '1rem 0' }}>
        {iconGrid(icons, searchText)}
      </div>
    </Stack>
  );
};
