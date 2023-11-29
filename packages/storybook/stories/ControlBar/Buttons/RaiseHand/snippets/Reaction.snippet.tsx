import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { ReactionButton } from '../../../../../../react-components/src/components';

export const ReactionButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ReactionButton showLabel={true} />
    </FluentThemeProvider>
  );
};