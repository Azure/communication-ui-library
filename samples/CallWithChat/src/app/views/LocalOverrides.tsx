// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useState } from 'react';
import { Checkbox, Dropdown, IconButton, SpinButton, Stack, Text, Toggle } from '@fluentui/react';
import { defaultThemes, useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';

export interface BrandingOverrides {
  logo?: string;
  themeColor?: string;
  background?: string;
  meetingDetails?: {
    title?: string;
    description?: string;
  };
}

export interface AppOverrides {
  mobile?: boolean;
}

export const SidePane = (props: {
  onAppOverridesUpdated?: (overrides: AppOverrides) => void;
  onBrandingOverridesUpdated?: (overrides: BrandingOverrides) => void;
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
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
      {isExpanded && (
        <LocalOverrides
          onBrandingOverridesUpdated={props.onBrandingOverridesUpdated}
          onAppOverridesUpdated={props.onAppOverridesUpdated}
        />
      )}
    </Stack>
  );
};

const dropdownOverrides = [
  {
    title: 'Theme Color',
    overrideName: 'themeColor',
    options: ['#ff6600', '#00ff00', '#0000ff', '#ff0000']
  },
  {
    title: 'Logo',
    overrideName: 'logo',
    options: ['logo1.png', 'logo2.png', 'logo3.png', 'logo4.png', 'none']
  },
  {
    title: 'Background',
    overrideName: 'background',
    options: ['background1.png', 'background2.png', 'background3.png', 'background4.png', 'none']
  }
];

export const LocalOverrides = (props: {
  onAppOverridesUpdated?: (overrides: AppOverrides) => void;
  onBrandingOverridesUpdated?: (overrides: BrandingOverrides) => void;
}): JSX.Element => {
  const { onAppOverridesUpdated, onBrandingOverridesUpdated } = props;
  const [appOverrides, setAppOverrides] = useState<AppOverrides>({
    mobile: false
  });
  const [brandingOverridesEnabled, setBrandingOverridesEnabled] = useState(false);
  const [brandingOverrides, setBrandingOverrides] = useState<BrandingOverrides>({
    logo: 'logo1.png',
    themeColor: '#ff6600',
    meetingDetails: {
      title: 'Contoso Medical Services',
      description: 'Joining a call with Contoso Medical Services'
    },
    background: 'background1.png'
  });

  useEffect(() => {
    onBrandingOverridesUpdated?.(brandingOverridesEnabled ? brandingOverrides : {});
  }, [brandingOverridesEnabled, onBrandingOverridesUpdated, brandingOverrides]);

  useEffect(() => {
    onAppOverridesUpdated?.(appOverrides);
  }, [onAppOverridesUpdated, appOverrides]);

  const { currentTheme, setCurrentTheme } = useSwitchableFluentTheme();
  const isDarkMode = currentTheme.name === 'Dark';
  const isMobile = !!appOverrides.mobile;

  return (
    <Stack
      verticalFill
      styles={{
        root: {
          padding: '1rem',
          minWidth: '17rem'
        }
      }}
    >
      <Text variant="xLarge">Test Overrides</Text>
      <Stack styles={{ root: { paddingTop: '2rem' } }} tokens={{ childrenGap: '1rem' }}>
        <Stack.Item>
          <OverrideSection title="Composite">
            <Checkbox
              label="Enable Branding Overrides"
              checked={brandingOverridesEnabled}
              onChange={(e, newValue) => {
                setBrandingOverridesEnabled(newValue ?? false);
              }}
            />
            {dropdownOverrides.map((override) => (
              <OverrideDropdownItem
                disabled={!brandingOverridesEnabled}
                key={override.title}
                title={override.title}
                defaultValue={override.options[0]}
                onChange={(value) => {
                  setBrandingOverrides((overrides) => ({ ...overrides, [override.overrideName]: value }));
                }}
                options={override.options}
              />
            ))}
          </OverrideSection>
        </Stack.Item>
        <Stack.Item>
          <OverrideSection title="App">
            <OverrideBooleanItem
              title={isDarkMode ? 'Dark Mode' : 'Light Mode'}
              checked={isDarkMode}
              onChange={(value) => {
                setCurrentTheme(value ? defaultThemes.Dark : defaultThemes.Light);
              }}
            />
            <OverrideBooleanItem
              title={isMobile ? 'Mobile' : 'Desktop'}
              checked={isMobile}
              onChange={(value) => {
                console.log(value);
                setAppOverrides((overrides) => ({ ...overrides, mobile: !!value }));
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

const OverrideItem = (props: { title: string; disabled: boolean; children: JSX.Element }): JSX.Element => {
  const { title, disabled, children } = props;

  return (
    <Stack horizontal tokens={{ childrenGap: '1rem' }}>
      <Stack.Item>
        <Text
          variant="medium"
          styles={{
            root: {
              color: disabled ? '#ccc' : undefined
            }
          }}
        >
          {title}
        </Text>
      </Stack.Item>
      <Stack.Item>{children}</Stack.Item>
    </Stack>
  );
};

// const OverrideSpinButtonItem = (props: {
//   title: string;
//   defaultValue: number;
//   onChange: (value: number) => void;
//   min?: number;
//   max?: number;
//   step?: number;
// }): JSX.Element => {
//   const { title, defaultValue, onChange, min, max, step } = props;

//   return (
//     <OverrideItem title={title}>
//       <SpinButton
//         defaultValue={defaultValue.toString()}
//         onChange={(e, newValue) => {
//           onChange(Number(newValue));
//         }}
//         min={min}
//         max={max}
//         step={step}
//       />
//     </OverrideItem>
//   );
// };

const OverrideBooleanItem = (props: {
  title: string;
  defaultValue?: boolean;
  disabled?: boolean;
  checked?: boolean;
  onChange: (value: boolean) => void;
}): JSX.Element => {
  const { title, checked, disabled, defaultValue, onChange } = props;

  return (
    <OverrideItem title={title} disabled={disabled ?? false}>
      <Toggle
        defaultChecked={defaultValue}
        checked={checked}
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
  disabled: boolean;
  options: string[];
}): JSX.Element => {
  const { title, defaultValue, onChange, options } = props;
  const [selectedKey, setSelectedKey] = useState<string | undefined>(defaultValue);

  return (
    <OverrideItem disabled={props.disabled} title={title}>
      <Dropdown
        onChange={(e, newValue) => {
          setSelectedKey(newValue?.key as string | undefined);
          onChange((newValue?.key ?? '') + '');
        }}
        selectedKey={selectedKey}
        options={options.map((option) => ({ key: option, text: option }))}
        disabled={props.disabled}
      />
    </OverrideItem>
  );
};
