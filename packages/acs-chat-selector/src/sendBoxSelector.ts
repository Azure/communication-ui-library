import { createSelector } from 'reselect';
import { getSelectorProps, SelectorProps } from './baseSelectors';

export const sendBoxSelector = createSelector([getSelectorProps], ({ displayName, userId }: SelectorProps) => ({
  displayName: displayName ?? '',
  userId: userId ?? '',
  disabled: false
}));
