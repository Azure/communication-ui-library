// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Dropdown, IconButton, SpinButton, Stack, Text, Toggle } from '@fluentui/react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';

export interface LocalOverrides {
  rtl?: boolean;
  language?: string;
  theme?: string;
  remoteParticipants?: number;
  cameraEnabled?: boolean;
}

export const SidePane = (props: { onOverridesUpdated?: (overrides: LocalOverrides) => void }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          borderLeft: '1px solid #ccc'
        }
      }}
    >
      <IconButton
        iconProps={{
          iconName: isExpanded ? 'ChevronRight' : 'ChevronLeft'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && <LocalOverrides onOverridesUpdated={props.onOverridesUpdated} />}
    </Stack>
  );
};

export const LocalOverrides = (props: { onOverridesUpdated?: (overrides: LocalOverrides) => void }): JSX.Element => {
  const { onOverridesUpdated } = props;

  const { currentTheme } = useSwitchableFluentTheme();
  const [overrides, setOverrides] = useState<LocalOverrides>({});

  useEffect(() => {
    onOverridesUpdated?.(overrides);
  }, [onOverridesUpdated, overrides]);

  return (
    <Stack
      verticalFill
      styles={{
        root: {
          padding: '1rem'
        }
      }}
    >
      <Text variant="xLarge">Local Overrides</Text>
      <Stack styles={{ root: { paddingTop: '2rem' } }} tokens={{ childrenGap: '1rem' }}>
        <Stack.Item>
          <OverrideSection title="App">
            <OverrideBooleanItem
              title="RTL"
              defaultValue={false}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, rtl: value }));
                // document.body.setAttribute('dir', value ? 'rtl' : 'ltr');
              }}
            />
            <OverrideDropdownItem
              title="Language"
              defaultValue={'en-us'}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, language: value }));
              }}
              options={['en-us', 'es-es', 'fr-fr', 'de-de', 'it-it', 'ja-jp', 'ko-kr', 'pt-br', 'ru-ru', 'zh-cn']}
            />
            <OverrideDropdownItem
              title="Theme"
              defaultValue={currentTheme.name}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, theme: value }));
              }}
              options={['Light', 'Dark', 'Teams', 'High contrast']}
            />
          </OverrideSection>
        </Stack.Item>
        <Stack.Item>
          <OverrideSection title="Devices">
            <OverrideBooleanItem
              title="Camera Enabled"
              defaultValue={true}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, cameraEnabled: value }));
              }}
            />
          </OverrideSection>
        </Stack.Item>
        <Stack.Item>
          <OverrideSection title="Call">
            <OverrideSpinButtonItem
              title="Remote Participants"
              defaultValue={0}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, remoteParticipants: value }));
              }}
              min={0}
              step={1}
            />
          </OverrideSection>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

const OverrideSection = (props: { title: string; children: React.ReactNode }): JSX.Element => {
  const { title, children } = props;

  return (
    <Stack tokens={{ childrenGap: '1rem' }}>
      <Stack.Item>
        <Text variant="large">{title}</Text>
      </Stack.Item>
      <Stack.Item>
        <Stack tokens={{ childrenGap: '1rem' }}>{children}</Stack>
      </Stack.Item>
    </Stack>
  );
};

const OverrideItem = (props: { title: string; children: JSX.Element }): JSX.Element => {
  const { title, children } = props;

  return (
    <Stack horizontal tokens={{ childrenGap: '1rem' }}>
      <Stack.Item>
        <Text variant="medium">{title}</Text>
      </Stack.Item>
      <Stack.Item>{children}</Stack.Item>
    </Stack>
  );
};

const OverrideSpinButtonItem = (props: {
  title: string;
  defaultValue: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}): JSX.Element => {
  const { title, defaultValue, onChange, min, max, step } = props;

  return (
    <OverrideItem title={title}>
      <SpinButton
        defaultValue={defaultValue.toString()}
        onChange={(e, newValue) => {
          onChange(Number(newValue));
        }}
        min={min}
        max={max}
        step={step}
      />
    </OverrideItem>
  );
};

const OverrideBooleanItem = (props: {
  title: string;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
}): JSX.Element => {
  const { title, defaultValue, onChange } = props;

  return (
    <OverrideItem title={title}>
      <Toggle
        defaultChecked={defaultValue}
        onChange={(e, newValue) => {
          onChange(newValue ?? false);
        }}
      />
    </OverrideItem>
  );
};

const OverrideDropdownItem = (props: {
  title: string;
  defaultValue: string;
  onChange: (value: string) => void;
  options: string[];
}): JSX.Element => {
  const { title, defaultValue, onChange, options } = props;
  const [selectedKey, setSelectedKey] = useState<string | undefined>(defaultValue);

  return (
    <OverrideItem title={title}>
      <Dropdown
        onChange={(e, newValue) => {
          setSelectedKey(newValue?.key as string | undefined);
          onChange((newValue?.key ?? '') + '');
        }}
        selectedKey={selectedKey}
        options={options.map((option) => ({ key: option, text: option }))}
      />
    </OverrideItem>
  );
};
