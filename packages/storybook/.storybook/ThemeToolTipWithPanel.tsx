import React, { useState } from 'react';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { useGlobals } from '@storybook/api';
import addons from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { TextField, DefaultButton, Stack, Panel, initializeIcons } from '@fluentui/react';
import { Theme } from '@fluentui/react-theme-provider';

export const ThemeToolTipWithPanel = (props: { active: boolean }): JSX.Element => {
  const [globals, updateGlobals] = useGlobals();
  const [textValue, setTextValue] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState('');

  initializeIcons();

  const validateThenUpdate = () => {
    if (!textValue.trim()) {
      setError('empty input');
      return;
    }
    try {
      // replace all object keys with json keys
      let themeJson = textValue.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
      // replace all single quotes
      themeJson = themeJson.replace(/'/g, '"');
      // replace trailing commas from object
      themeJson = themeJson.replace(/\,(?!\s*[\{\"\w])/g, '');
      JSON.parse(themeJson) as Theme;
      updateGlobals({ ['theme']: 'Custom', ['customTheme']: themeJson });
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
      setTextValue(themeJson);
      setShowPanel(false);
    } catch (e) {
      setError(e.toString());
    }
  };

  const setText = (e: any): void => {
    setError(undefined);
    setTextValue(e.target.value);
  };

  const themeOptions = [
    {
      id: 'Light',
      title: 'Light',
      onClick: () => {
        setShowPanel(false);
        updateGlobals({ ['theme']: 'Light', ['customTheme']: '' });
        // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
        addons.getChannel().emit(FORCE_RE_RENDER);
      },
      active: globals['theme'] === 'Light'
    },
    {
      id: 'Dark',
      title: 'Dark',
      onClick: () => {
        setShowPanel(false);
        updateGlobals({ ['theme']: 'Dark', ['customTheme']: '' });
        // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
        addons.getChannel().emit(FORCE_RE_RENDER);
      },
      active: globals['theme'] === 'Dark'
    },
    { id: 'Custom', title: 'Custom', onClick: () => setShowPanel(true), active: globals['theme'] === 'Custom' }
  ];

  return (
    <WithTooltip placement="top" trigger="click" closeOnClick={true} tooltip={<TooltipLinkList links={themeOptions} />}>
      <IconButton key="background" title="Change the background of the preview" active={props.active}>
        <Icons icon="paintbrush" />
      </IconButton>
      <Panel
        headerText="Apply a custom theme"
        isOpen={showPanel}
        onDismiss={() => setShowPanel(false)}
        hasCloseButton={true}
        closeButtonAriaLabel="Close"
        isLightDismiss={true}
        onDismissed={() => setError('')}
      >
        <Stack>
          <p>Enter your fluent theme in JSON format in the text field below and click 'Apply'</p>
          <TextField
            value={textValue}
            onChange={setText}
            errorMessage={error}
            multiline={true}
            styles={{ fieldGroup: { height: '32rem' }, root: { height: '35rem' } }}
          />
          <Stack horizontal tokens={{ childrenGap: '1rem' }}>
            <DefaultButton
              onClick={() => {
                setTextValue('');
                setError('');
              }}
            >
              Clear
            </DefaultButton>
            <DefaultButton onClick={() => validateThenUpdate()}>Apply</DefaultButton>
          </Stack>
        </Stack>
      </Panel>
    </WithTooltip>
  );
};
