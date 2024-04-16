import React from 'react';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { addons, useGlobals } from '@storybook/manager-api';
import { FORCE_RE_RENDER } from '@storybook/core-events';

export const TextDirectionToolTip = (props: { active: boolean }): JSX.Element => {
  const [globals, updateGlobals] = useGlobals();

  const textDirectionOptions = [
    { id: 'ltr', title: 'Left-to-right' },
    { id: 'rtl', title: 'Right-to-left' }
  ].map(option => {
    return {
      id: option.id,
      title: option.title,
      onClick: () => {
        updateGlobals({ ['rtl']: option.id });
        addons.getChannel().emit(FORCE_RE_RENDER);
      },
      active: globals['textDirection'] === option
    }
  })

  return (
    <WithTooltip placement="top" trigger="click" closeOnClick={true} tooltip={<TooltipLinkList links={textDirectionOptions} />}>
      <IconButton key="rtl" title="Change the text direction" active={props.active}>
        <Icons icon="transfer" />
      </IconButton>
    </WithTooltip>
  );
};
