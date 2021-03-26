// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { IncomingCallModal } from '../../composites/OneToOneCall/IncomingCallAlerts';
import { text, files, boolean } from '@storybook/addon-knobs';
import { getDocs } from './ThemesDocs';
import { renderVideoStream } from '../utils';
import { EXAMPLES_FOLDER_PREFIX } from '../constants';

export const TeamsThemeComponent: () => JSX.Element = () => {
  return <div>Placeholder</div>;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Themes`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
