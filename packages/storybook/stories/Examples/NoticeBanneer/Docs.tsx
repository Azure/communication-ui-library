import { Title } from '@storybook/addon-docs/blocks';
import React from 'react';
// const LobbyControlBarText = require('!!raw-loader!./snippets/LobbyControlBar.snippet.tsx').default;
// const LobbyComponentText = require('!!raw-loader!./snippets/Lobby.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Move along folks!</Title>
      <p>Absolutely nothing to see here, ya know!</p>
    </>
  );
};
