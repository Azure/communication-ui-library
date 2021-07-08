// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@internal/react-composites';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../constants';

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-meeting`,
  title: `${COMPOSITE_FOLDER_PREFIX}/MeetingComposite`,
  component: MeetingComposite,
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export { BasicExample } from './BasicExample';

const getDocs: () => JSX.Element = () => <></>;
