// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './IncomingCallAlertsDocs';

export { IncomingCallModal } from './IncomingCallModal';
export { IncomingCallToast } from './IncomingCallToast';

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Incoming Call Alerts`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
