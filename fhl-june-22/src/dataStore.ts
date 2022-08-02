import { ControlBarLayout } from '@azure/communication-react';

export const GLOBAL: {
  videoGalleryLayout: string;
  controlBarLayout: ControlBarLayout;
  controlBarButtons: Array<string>;
  controlBarButtonsLarge: boolean;
  controlBarButtonsLabeled: boolean;
} = {
  videoGalleryLayout: '',
  controlBarLayout: 'floatingBottom',
  controlBarButtons: [],
  controlBarButtonsLarge: true,
  controlBarButtonsLabeled: false
};
