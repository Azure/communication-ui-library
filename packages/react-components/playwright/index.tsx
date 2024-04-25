// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIcons } from '@fluentui/react';
import { DEFAULT_COMPONENT_ICONS } from '../src/theming/icons';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

// Apply theme here, add anything your component needs at runtime here.
registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});
initializeFileTypeIcons();
