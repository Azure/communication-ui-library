import React from 'react';
import { MessageBar } from '@fluentui/react';

export const Banner = (): JSX.Element => {
  // TODO: Make dismissable.
  return (
    <MessageBar styles={{ content: { alignItems: 'center' } }}>There will be real messages here, trust me.</MessageBar>
  );
};
