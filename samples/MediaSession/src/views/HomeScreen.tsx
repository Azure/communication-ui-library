// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PrimaryButton, Stack, Image } from '@fluentui/react';
import React, { useState } from 'react';
import { mergeStyles } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';

export interface HomeScreenProps {
  onStartClick: () => Promise<void>;
}

const headerImage = { src: heroSVG.toString() };

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const [starting, setStarting] = useState(false);
  return (
    <Stack horizontal tokens={{ childrenGap: '1rem' }}>
      <Stack verticalAlign="center">
        <Image alt="Welcome to the ACS Media Stream Sample App" className={imgStyle} {...headerImage} />
      </Stack>
      <Stack tokens={{ childrenGap: '1rem' }} style={{ minWidth: '20rem', margin: 'auto' }}>
        <PrimaryButton
          disabled={starting}
          onClick={async () => {
            setStarting(true);
            try {
              await props.onStartClick();
            } finally {
              setStarting(false);
            }
          }}
        >
          Start Session
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

export const imgStyle = mergeStyles({
  width: '16.5rem',
  padding: '0.5rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  }
});
