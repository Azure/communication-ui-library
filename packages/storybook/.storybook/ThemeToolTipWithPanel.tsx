import React, { useState } from 'react';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { Link } from '@storybook/components/dist/cjs/tooltip/TooltipLinkList';
import { useGlobals } from '@storybook/api';
import addons from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { TextField, DefaultButton, Stack, Panel} from '@fluentui/react';
import { THEMES } from '../stories/themes';

export const ThemeToolTipWithPanel = (props: { active: boolean }): JSX.Element => {
  const [globals, updateGlobals] = useGlobals();
  const [textValue, setTextValue] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [error, setError] = useState('');

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

      let customThemeValue = themeJson;
      // if themeObject does not have palette property then assume it is the palette
      const themeObject = JSON.parse(themeJson);
      if (!themeObject.palette) {
        customThemeValue = JSON.stringify({ palette: themeObject });
      }
      updateGlobals({ ['theme']: 'Custom', ['customTheme']: customThemeValue });
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
      setTextValue(themeJson);
      setShowPanel(false);
    } catch (e) {
      setError(e.toString());
    }
  };

  const setText = (e: any): void => {
    setError('');
    setTextValue(e.target.value);
  };

  const themeOptions: Link[] = []
  Object.keys(THEMES).forEach((theme) => 
    themeOptions.push(    {
      id: theme,
      title: theme,
      onClick: () => {
        setShowPanel(false);
        updateGlobals({ ['theme']: theme, ['customTheme']: '' });
        // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
        addons.getChannel().emit(FORCE_RE_RENDER);
      },
      active: globals['theme'] === theme
    })
  )
  themeOptions.push({ id: 'Custom', title: 'Custom', onClick: () => setShowPanel(true), active: globals['theme'] === 'Custom' });

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
              text={'Clear'}
              onClick={() => {
                setTextValue('');
                setError('');
              }}
            />
            <DefaultButton text={'Apply'} onClick={() => validateThenUpdate()} />
          </Stack>
        </Stack>
      </Panel>
    </WithTooltip>
  );
};
