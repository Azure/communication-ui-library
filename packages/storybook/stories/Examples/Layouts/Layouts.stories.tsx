// © Microsoft Corporation. All rights reserved.

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Meta } from '@storybook/react/types-6-0';
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
