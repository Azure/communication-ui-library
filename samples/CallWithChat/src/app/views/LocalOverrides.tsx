// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Dropdown, IconButton, SpinButton, Stack, Text, TextField, Toggle } from '@fluentui/react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useIsMobile';

export interface LocalOverrides {
  rtl?: boolean;
  language?: string;
  theme?: string;
  remoteParticipants?: number;
  cameraEnabled?: boolean;
  background?: string;
  callTitle?: string;
  callDescription?: string;
  logo?: string;
  logoShape?: string;
}

export const SidePane = (props: { onOverridesUpdated?: (overrides: LocalOverrides) => void }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { currentTheme } = useSwitchableFluentTheme();
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          borderLeft: '1px solid #ccc',
          position: isMobile ? 'fixed' : undefined,
          top: isMobile ? '0' : undefined,
          right: isMobile ? '0' : undefined,
          background: currentTheme.theme.palette?.neutralLighter,
          zIndex: isMobile ? 9999999 : undefined
        }
      }}
    >
      <IconButton
        iconProps={{
          iconName: isExpanded ? 'ChevronRight' : 'ChevronLeft'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <LocalOverrides onOverridesUpdated={props.onOverridesUpdated} isHidden={!isExpanded} />
    </Stack>
  );
};

const localOverrideDefaults = {
  rtl: false,
  language: 'en-US',
  theme: 'Light',
  remoteParticipants: 0,
  cameraEnabled: true,
  background: 'None',
  callTitle: 'Start a Call',
  callDescription: undefined,
  logo: 'acsLogo.svg',
  logoShape: 'unset'
};

export const LocalOverrides = (props: {
  isHidden: boolean;
  onOverridesUpdated?: (overrides: LocalOverrides) => void;
}): JSX.Element => {
  const { onOverridesUpdated } = props;

  const { currentTheme } = useSwitchableFluentTheme();
  const [overrides, setOverrides] = useState<LocalOverrides>(localOverrideDefaults);

  useEffect(() => {
    onOverridesUpdated?.(overrides);
  }, [onOverridesUpdated, overrides]);

  if (props.isHidden) {
    return <></>;
  }

  return (
    <Stack
      verticalFill
      styles={{
        root: {
          padding: '1rem',
          minWidth: '22rem'
        }
      }}
    >
      <Text variant="xLarge">Local Overrides</Text>
      <Stack styles={{ root: { paddingTop: '2rem' } }} tokens={{ childrenGap: '1rem' }}>
        <Stack.Item>
          <OverrideSection title="App">
            <OverrideDropdownItem
              title="Theme"
              defaultValue={currentTheme.name}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, theme: value }));
              }}
              options={['Light', 'Dark']}
            />
            <OverrideDropdownItem
              title="Background"
              defaultValue={overrides.background ?? localOverrideDefaults.background}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, background: value }));
              }}
              options={[
                'None',
                'Light',
                'Dark',
                'penguinHula.jpg',
                'teams-background-light.png',
                'teams-background-dark.png'
              ]}
            />
            <OverrideDropdownItem
              title="Logo"
              defaultValue={overrides.logo ?? localOverrideDefaults.logo}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, logo: value }));
              }}
              options={['None', 'acsLogo.svg', 'microsoftLogo.png', 'walmartlogo.png', 'penguinHula.jpg']}
            />
            <OverrideDropdownItem
              title="Logo Shape"
              defaultValue={overrides.logoShape ?? localOverrideDefaults.logoShape}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, logoShape: value }));
              }}
              options={['unset', 'circle']}
            />
            <OverrideBooleanItem
              title="RTL"
              defaultValue={overrides.rtl ?? localOverrideDefaults.rtl}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, rtl: value }));
                document.body.setAttribute('dir', value ? 'rtl' : 'ltr');
              }}
            />
          </OverrideSection>
        </Stack.Item>
        <Stack.Item>
          <OverrideSection title="Strings">
            <OverrideTextItem
              title="Call Title"
              defaultValue={overrides.callTitle ?? localOverrideDefaults.callTitle}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, callTitle: value }));
              }}
            />
            <OverrideTextItem
              title="Call Description"
              defaultValue={overrides.callDescription ?? localOverrideDefaults.callDescription}
              onChange={(value) => {
                setOverrides((overrides) => ({ ...overrides, callDescription: value }));
              }}
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

const OverrideTextItem = (props: {
  title: string;
  defaultValue?: string;
  onChange: (value?: string) => void;
}): JSX.Element => {
  const { title, defaultValue, onChange } = props;

  return (
    <OverrideItem title={title}>
      <TextField onChange={(_, newValue) => onChange(newValue)} defaultValue={defaultValue} />
    </OverrideItem>
  );
};
