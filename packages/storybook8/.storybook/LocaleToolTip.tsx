import React from 'react';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { addons, useGlobals } from '@storybook/manager-api';

import { LOCALES } from '../stories/locales'
import { FORCE_RE_RENDER } from '@storybook/core-events';

export const LocaleToolTip = (props: { active: boolean }): JSX.Element => {
  const [globals, updateGlobals] = useGlobals();

  const localeOptions = Object.keys(LOCALES)
    .map((key) => ({ title: LOCALES[key].englishName, id: key, onClick:() => {
      updateGlobals({ ['locale']: key});
      addons.getChannel().emit(FORCE_RE_RENDER);
  }, active: globals['locale'] === key  }
  ))

  return (
    <WithTooltip placement="top" trigger="click" closeOnClick={true} tooltip={<TooltipLinkList links={localeOptions} />}>
      <IconButton key="rtl" title="Change the current locale" active={props.active}>
        <Icons icon="globe" />
      </IconButton>
    </WithTooltip>
  );
};
