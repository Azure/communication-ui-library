// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './LayoutsDocs';

export { OneToOneCallLayout } from './OneToOneCallLayout';
export { ScreenShareLayout } from './ScreenShareLayout';

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
