// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable import/no-duplicates */

import { CallComposite, CallingTheme, ChatTheme, lightTheme } from '@azure/communication-react';
import {
  Stack,
  ColorPicker,
  IColor,
  getColorFromString,
  IColorPickerStyles,
  PrimaryButton,
  PartialTheme,
  IChoiceGroupOption,
  ChoiceGroup,
  Label,
  IContextualMenuItem,
  DefaultButton,
  IContextualMenuProps
} from '@fluentui/react';

import { Description, Heading, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';
import { ArgsFrom, controlsToAdd, defaultCallCompositeHiddenControls } from '../controlsUtils';
import { MockCallAdapter } from './themeToolUtils/CompositeMocks';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from './themeToolUtils/ThemeCallCompositeUtils';

const docs = (): JSX.Element => {
  return (
    <Stack>
      <Title>Call Composite Theming Tool</Title>
      <SingleLineBetaBanner></SingleLineBetaBanner>
      <Description>
        This Tool is to help with the customization of the Azure Communication Services Call Composite. Please see our
        CallComposite documentation for more information about how the props for our composite works.
      </Description>
      <Heading>Using the tool</Heading>
      <Description>
        On the preview tab of this page you will find the tool. You will be greeted by a CallComposite and a color
        picker. Currently our CallComposite takes its theme through a similar object as a Fluent theme. This tool is
        meant to be a playground for you to change those theme values without needing to run our CallComposite in your
        application.
      </Description>
      <Subheading>The Controls</Subheading>
      <Description>We have provided a couple of storybook controls to help with your customization.</Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Call Page - This control is to select the current page of the CallComposite.</li>
        <li>
          Selected color dropdown - This dropdown is to change the currently selected section of the Composite's theme.
        </li>
        <li>
          Color picker - Use this to choose a color to base the theme section on. Will show the currently selected
          colour in the picker.
        </li>
        <li>
          Show theme button - Once you are finished with the customization press this to get the completed theme object
          for your application.
        </li>
      </ul>
      <Description>
        Using these controls you can navigate the CallComposite manually to each page to see how the colors that you
        changed affect these different screens.
      </Description>
    </Stack>
  );
};

const storyControls = {
  callPage: controlsToAdd.callPage
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const white = getColorFromString('#ffffff')!;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThemeToolStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const gary = defaultMockRemoteParticipant('Gary');
  const Larry = defaultMockRemoteParticipant('Larry');
  const Berry = defaultMockRemoteParticipant('Berry');

  const remoteParticipants = [gary, Larry, Berry];

  const compositeFormFactors: IChoiceGroupOption[] = [
    { key: 'desktop', text: 'Desktop' },
    { key: 'mobile', text: 'Mobile' },
    { key: 'widget', text: 'Widget' }
  ];
  const [chosenFormFactor, setChosenFormFactor] = useState<IChoiceGroupOption>(compositeFormFactors[0]);

  const mockCallAdapterState = defaultMockCallAdapterState(remoteParticipants);

  const [themeColourToEdit, setThemeColourToEdit] = useState<string>();

  const [userTheme, setUserTheme] = useState<PartialTheme & CallingTheme & ChatTheme>(lightTheme);
  const [showTheme, setShowTheme] = useState<boolean>(false);

  const [color, setColor] = useState(white);
  const [callPage, setCallPage] = useState(args.callPage);
  mockCallAdapterState.page = callPage;
  const adapter = new MockCallAdapter(mockCallAdapterState);

  const colorMenuProps: IContextualMenuProps = useMemo(() => {
    const menuOptions: IContextualMenuItem[] = [
      {
        key: 'theme',
        text: 'Theme color',
        subMenuProps: {
          items: [
            {
              key: 'themePrimary',
              text: 'Theme primary color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themePrimary'] as unknown as IColor);
                  setThemeColourToEdit('themePrimary');
                }
              }
            },
            {
              key: 'themeSecondary',
              text: 'Theme secondary color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themeSecondary'] as unknown as IColor);
                  setThemeColourToEdit('themeSecondary');
                }
              }
            },
            {
              key: 'themeTertiary',
              text: 'Theme tertiary color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themeTertiary'] as unknown as IColor);
                  setThemeColourToEdit('themeTertiary');
                }
              }
            },
            {
              key: 'themeDark',
              text: 'Dark theme color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themeDark'] as unknown as IColor);
                  setThemeColourToEdit('themeDark');
                }
              }
            }
          ]
        }
      },
      {
        key: 'neutral',
        text: 'Neutral color',
        subMenuProps: {
          items: [
            {
              key: 'themeNeutralPrimary',
              text: 'Neutral color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themeNeutralPrimary'] as unknown as IColor);
                  setThemeColourToEdit('themeNeutralPrimary');
                }
              }
            },
            {
              key: 'themeNeutralDark',
              text: 'Neutral dark color',
              onClick: () => {
                if (userTheme.palette) {
                  setColor(userTheme.palette['themeNeutralDark'] as unknown as IColor);
                  setThemeColourToEdit('themeNeutralDark');
                }
              }
            }
          ]
        }
      },
      { key: 'white', text: 'Background' }
    ];
    return { items: menuOptions, subMenuHoverDelay: 250 };
  }, [userTheme.palette]);

  useEffect(() => {
    setCallPage(args.callPage);
  }, [args.callPage]);

  const updateColor = React.useCallback(
    (ev: any, colorObj: IColor) => {
      setColor(colorObj);
      switch (themeColourToEdit) {
        case 'themePrimary': {
          if (userTheme.palette) {
            const lightGradient = findGradient(colorObj.str, 5, 'light');
            userTheme.palette['themePrimary'] = colorObj.str;
            userTheme.palette['themeLight'] = lightGradient[1];
            userTheme.palette['themeLighter'] = lightGradient[2];
            userTheme.palette['themeLighterAlt'] = lightGradient[3];
            setUserTheme(userTheme);
          }
          return;
        }
        case 'themeSecondary': {
          if (userTheme.palette) {
            userTheme.palette['themeSecondary'] = colorObj.str;
            setUserTheme(userTheme);
          }
          return;
        }
        case 'themeTertiary': {
          if (userTheme.palette) {
            userTheme.palette['themeTertiary'] = colorObj.str;
            setUserTheme(userTheme);
          }
          return;
        }
        case 'themeDark': {
          if (userTheme.palette) {
            const darkGradient = findGradient(colorObj.str, 4, 'dark');
            userTheme.palette['themeDark'] = darkGradient[0];
            userTheme.palette['themeDarker'] = darkGradient[1];
            userTheme.palette['themeDarkAlt'] = darkGradient[2];
            setUserTheme(userTheme);
          }
          return;
        }
        case 'themeNeutralPrimary': {
          if (userTheme.palette) {
            const gradient = findGradient(colorObj.str, 9, 'light');
            userTheme.palette['neutralPrimary'] = colorObj.str;
            userTheme.palette['neutralSecondary'] = gradient[0];
            userTheme.palette['neutralTertiary'] = gradient[1];
            userTheme.palette['neutralTertiaryAlt'] = gradient[2];
            userTheme.palette['neutralQuaternary'] = gradient[3];
            userTheme.palette['neutralQuaternaryAlt'] = gradient[4];
            userTheme.palette['neutralLight'] = gradient[5];
            userTheme.palette['neutralLighter'] = gradient[6];
            userTheme.palette['neutralLighterAlt'] = gradient[7];
            setUserTheme(userTheme);
          }
          return;
        }
        case 'themeNeutralDark': {
          if (userTheme.palette) {
            userTheme.palette['neutralDark'] = colorObj.str;
            setUserTheme(userTheme);
          }
          return;
        }
        case 'white': {
          if (userTheme.palette) {
            userTheme.palette['white'] = colorObj.str;
            setUserTheme(userTheme);
          }
        }
      }
    },
    [themeColourToEdit, userTheme]
  );

  return (
    <Stack tokens={{ childrenGap: '1rem' }} style={{ padding: '3rem', background: 'white', height: '100%' }}>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <Stack
          style={{
            width: chosenFormFactor.key === 'mobile' ? '25rem' : chosenFormFactor.key === 'widget' ? '30rem' : '55rem',
            height: chosenFormFactor.key === 'mobile' ? '44rem' : chosenFormFactor.key === 'widget' ? '22rem' : '25rem'
          }}
        >
          <CallComposite
            adapter={adapter}
            key={Math.random()}
            fluentTheme={userTheme}
            formFactor={chosenFormFactor.key === 'mobile' ? 'mobile' : 'desktop'}
            options={{
              callControls: {
                peopleButton: !(chosenFormFactor.key === 'widget'),
                screenShareButton: !(chosenFormFactor.key === 'widget'),
                displayType: !(chosenFormFactor.key === 'widget') ? 'default' : 'compact'
              },
              localVideoTile: {
                position: chosenFormFactor.key === 'widget' ? 'grid' : undefined
              }
            }}
          />
        </Stack>
        <Stack>
          <ColorPicker
            color={color}
            onChange={updateColor}
            showPreview={true}
            styles={colorPickerStyles}
            alphaType={'none'}
          ></ColorPicker>
          <Label>Color being edited: {themeColourToEdit}</Label>
        </Stack>
      </Stack>
      <Stack horizontal tokens={{ childrenGap: '2rem' }}>
        <Stack tokens={{ childrenGap: '2rem' }}>
          <DefaultButton text="Select a color to edit" menuProps={colorMenuProps} />
          <PrimaryButton onClick={() => setShowTheme(!showTheme)} style={{ width: '20rem' }}>
            Show Theme
          </PrimaryButton>
        </Stack>
        <Stack>
          <ChoiceGroup
            defaultSelectedKey={chosenFormFactor.key}
            options={compositeFormFactors}
            label={'Composite form factor'}
            onChange={(ev?: React.FormEvent<HTMLInputElement | HTMLElement>, option?: IChoiceGroupOption) => {
              if (option) {
                setChosenFormFactor(option);
              }
            }}
          ></ChoiceGroup>
        </Stack>
        <Stack>
          {showTheme && (
            <Stack>
              <Label>Theme - copy this for use in your application</Label>
              <pre style={{ width: '20rem', height: '20rem', overflow: 'scroll' }}>
                {JSON.stringify(userTheme, null, 2)}
              </pre>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export const themeTool = ThemeToolStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-themetool`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Theming tool`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      //Prevent Docs auto scroll to top
      container: null,
      page: () => docs()
    }
  }
} as Meta;

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 352,
    minWidth: 352
  },
  colorRectangle: { height: 268 }
};

/**
 * Function for creating a colour gradient to black or white based on the color given
 */
// steps for calculating gradient
// 1. convert hex to rgb
// 2. set number of steps in gradient
// 3. calculate difference between rgb values and white <- reverse if for black
// 4. divide difference by number of steps - 1
// 5. add difference to rgb values
// 6. convert rgb to hex
// 7. add hex values to array
const findGradient = (color: string, steps: number, direction: string): string[] => {
  console.log('calculating gradient');
  const gradient: string[] = [];
  const rgb = [
    parseInt(color.substring(1, 3), 16),
    parseInt(color.substring(3, 5), 16),
    parseInt(color.substring(5, 7), 16)
  ];
  if (direction === 'light') {
    const redDiff = 255 - rgb[0];
    const greenDiff = 255 - rgb[1];
    const blueDiff = 255 - rgb[2];
    const redStep = redDiff / (steps - 1);
    const greenStep = greenDiff / (steps - 1);
    const blueStep = blueDiff / (steps - 1);
    for (let i = 0; i < steps; i++) {
      const red = Math.round(rgb[0] + redStep * i);
      const green = Math.round(rgb[1] + greenStep * i);
      const blue = Math.round(rgb[2] + blueStep * i);
      const hex = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
      gradient.push(hex);
    }
  } else {
    const redDiff = rgb[0] - 0;
    const greenDiff = rgb[1] - 0;
    const blueDiff = rgb[2] - 0;
    const redStep = redDiff / (steps - 1);
    const greenStep = greenDiff / (steps - 1);
    const blueStep = blueDiff / (steps - 1);
    for (let i = 0; i < steps; i++) {
      const red = Math.round(rgb[0] - redStep * i);
      const green = Math.round(rgb[1] - greenStep * i);
      const blue = Math.round(rgb[2] - blueStep * i);
      const hex = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
      gradient.push(hex);
    }
  }
  return gradient;
};
