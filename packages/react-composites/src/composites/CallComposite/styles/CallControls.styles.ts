// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';

/** @private */
export const controlBarContainerStyles: IStyle = {
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  // @TODO: this should be exposed through a custom CallComposite Theme API that extends the fluent theme with semantic values
  boxShadow: `
    0px 6.400000095367432px 14.399999618530273px 0px #00000021;
    0px 1.2000000476837158px 3.5999999046325684px 0px #0000001A;
  `
};
