// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, shorthands } from '@fluentui/react-components';

/**
 * Styles to hide the announcer from view but still existing on the DOM tree it so that narration can happen.
 *
 * @internal
 */
export const _useAnnouncerStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    ...shorthands.padding(0),
    ...shorthands.border(0),
    ...shorthands.margin('-1px'),
    ...shorthands.overflow('hidden'),
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap'
  }
});
