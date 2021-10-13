// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import {
  ChoiceGroup,
  IChoiceGroupOption,
  IChoiceGroupOptionStyles,
  IChoiceGroupStyles,
  IPalette,
  useTheme
} from '@fluentui/react';

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
  const containerStyles: IChoiceGroupStyles = {
    root: {
      height: '100%',
      width: '100%'
    }
  };
  const pollSelectionStyles = (palette: IPalette, isSelected: boolean): IChoiceGroupOptionStyles => ({
    root: {
      padding: '15px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '20px',
      border: `1.5px solid ${isSelected ? palette.themePrimary : palette.neutralQuaternary}`,
      width: '100%',
      height: '50px'
    },
    labelWrapper: {
      paddingLeft: '36px'
    }
  });

  const choiceGroupSelections: IChoiceGroupOption[] = props.pollOptions.map((pollOption, index) => ({
    key: `${index}`,
    text: pollOption.option,
    ariaLabel: pollOption.option,
    defaultChecked: pollOption.chosen,
    styles: pollSelectionStyles(palette, pollOption.chosen)
  }));

  return <ChoiceGroup styles={containerStyles} disabled={!props.interactive} options={choiceGroupSelections} />;
};
