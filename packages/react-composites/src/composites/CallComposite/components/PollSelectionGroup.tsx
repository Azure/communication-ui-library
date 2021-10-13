// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupOptionStyles, IPalette, useTheme } from '@fluentui/react';

/**
 * @private
 */
export interface PollOption {
  option: string;
  chosen: boolean;
}

/**
 * @private
 */
export type PollOptions = PollOption[];

/**
 * @private
 */
export interface PollSelectionGroupProps {
  pollOptions: PollOptions;
  interactive: boolean;
}

/**
 * @private
 */
export const PollSelectionGroup = (props: PollSelectionGroupProps): JSX.Element => {
  const palette = useTheme().palette;
  const pollSelectionStyles = (palette: IPalette, isSelected: boolean): IChoiceGroupOptionStyles => ({
    root: {
      margin: '15px',
      borderRadius: '4px',
      fontSize: '12px',
      lineHeight: '16px',
      border: `1.5px solid ${isSelected ? palette.themePrimary : palette.neutralQuaternary}`,
      width: '100%',
      height: '50px'
    }
  });

  const choiceGroupSelections: IChoiceGroupOption[] = props.pollOptions.map((pollOption, index) => ({
    key: `${index}`,
    text: pollOption.option,
    ariaLabel: pollOption.option,
    defaultChecked: pollOption.chosen,
    styles: pollSelectionStyles(palette, pollOption.chosen)
  }));
  return <ChoiceGroup disabled={!props.interactive} options={choiceGroupSelections} />;
};
