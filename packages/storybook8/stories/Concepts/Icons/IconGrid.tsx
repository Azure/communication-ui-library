// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { mergeStyles, Stack, TextField } from '@fluentui/react';
import React, { useState } from 'react';

const IconGrid = (props: { allIcons: Record<string, JSX.Element>; searchText?: string }): JSX.Element => {
  const { allIcons, searchText } = props;
  const allIconKeys = Object.keys(allIcons).sort();
  const filteredKeys = searchText
    ? allIconKeys.filter((k) => k.toLowerCase().includes(searchText.toLowerCase()))
    : allIconKeys;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', padding: '1rem 0' }}>
      {filteredKeys.map((key, idx) => {
        return (
          <Stack
            key={idx}
            horizontal
            style={{
              padding: '0.5rem 0'
            }}
            verticalAlign="center"
          >
            <Stack horizontalAlign="start" className={mergeStyles({ span: { fontSize: '1rem', lineHeight: 0 } })}>
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
      })}
    </div>
  );
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

  const iconGroups = groupIcons(icons);

  return (
    <Stack>
      <SearchBar onChange={(val) => setSearchText(val)} />
      {Object.keys(iconGroups).map((key) => (
        <React.Fragment key={key}>
          <IconGrid allIcons={iconGroups[key]} searchText={searchText} />
        </React.Fragment>
      ))}
    </Stack>
  );
};

const groupIcons = (icons: Record<string, JSX.Element>): Record<string, Record<string, JSX.Element>> => {
  const iconGroups: Record<string, Record<string, JSX.Element>> = { general: {}, callReadiness: {} };

  Object.keys(icons).forEach((key) => {
    if (callReadinessIconKeys.includes(key)) {
      iconGroups.callReadiness[key] = icons[key];
    } else {
      iconGroups.general[key] = icons[key];
    }
  });

  return iconGroups;
};

const callReadinessIconKeys = [
  'BrowserPermissionDeniedError',
  'SitePermissionCamera',
  'SitePermissionCameraDenied',
  'SitePermissionMic',
  'SitePermissionMicDenied',
  'SitePermissionsSparkle',
  'UnsupportedEnvironmentWarning'
];
