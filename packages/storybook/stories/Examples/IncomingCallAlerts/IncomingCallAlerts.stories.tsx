// © Microsoft Corporation. All rights reserved.

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { Meta } from '@storybook/react/types-6-0';
import { getDocs } from './IncomingCallAlertsDocs';

export { IncomingCallModal } from './IncomingCallModal';
export { IncomingCallToast } from './IncomingCallToast';

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/IncomingCallAlerts`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
