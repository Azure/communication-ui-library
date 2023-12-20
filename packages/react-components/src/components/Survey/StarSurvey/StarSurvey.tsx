// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useCallback } from 'react';
import { Text, useTheme, Stack } from '@fluentui/react';
import { Rating, RatingSize } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import { helperTextStyle, ratingHelperTextStyle, ratingStyles, titleContainerClassName } from './StarSurvey.styles';
import { _CallSurvey, _CallSurveyResponse } from '../SurveyTypes';
/**
 * Strings of {@link StarSurvey} that can be overridden.
 *
 * @internal
 */
export interface _StarSurveyStrings {
  /**
   * Helper text displayed below survey question before user choose a response
   */
  starSurveyHelperText?: string;
  /**
   * Helper text displayed below survey stars after user select one star
   */
  starSurveyOneStarText?: string;
  /**
   * Helper text displayed below survey stars after user select two star
   */
  starSurveyTwoStarText?: string;
  /**
   * Helper text displayed below survey stars after user select three star
   */
  starSurveyThreeStarText?: string;
  /**
   * Helper text displayed below survey stars after user select four star
   */
  starSurveyFourStarText?: string;
  /**
   * Helper text displayed below survey stars after user select five star
   */
  starSurveyFiveStarText?: string;
  /**
   * Aria Label for each individual star rating
   */
  starRatingAriaLabel?: string;
}

/**
 * Props for {@link StarSurvey} component.
 *
 * @internal
 */
export interface _StarSurveyProps {
  /**
   * Custom icon name for selected rating elements.
   * @defaultvalue FavoriteStarFill
   */
  selectedIcon?: string;
  /**
   * Custom icon name for unselected rating elements.
   * @defaultvalue FavoriteStar
   */
  unselectedIcon?: string;
  /** function called on star rating click*/
  onStarRatingSelected?: (ratings: number) => void;
  /** Star survey strings */
  strings?: _StarSurveyStrings;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @internal
 */
export const _StarSurvey = (props: _StarSurveyProps): JSX.Element => {
  const { onStarRatingSelected, selectedIcon, unselectedIcon, strings } = props;

  const [rating, setRating] = useState(0);

  const [ratingHelperText, setRatingHelperText] = useState<string | undefined>('');

  const theme = useTheme();

  const onRatingChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, rating?: number | undefined): void => {
      if (rating) {
        setRating(rating);

        switch (rating) {
          case 1:
            setRatingHelperText(strings?.starSurveyOneStarText);
            break;
          case 2:
            setRatingHelperText(strings?.starSurveyTwoStarText);
            break;
          case 3:
            setRatingHelperText(strings?.starSurveyThreeStarText);
            break;
          case 4:
            setRatingHelperText(strings?.starSurveyFourStarText);
            break;
          case 5:
            setRatingHelperText(strings?.starSurveyFiveStarText);
            break;
          default:
            break;
        }

        onStarRatingSelected?.(rating);
      }
    },
    [
      strings?.starSurveyOneStarText,
      strings?.starSurveyTwoStarText,
      strings?.starSurveyThreeStarText,
      strings?.starSurveyFourStarText,
      strings?.starSurveyFiveStarText,
      onStarRatingSelected
    ]
  );

  return (
    <Stack verticalAlign="center">
      <Stack className={titleContainerClassName}>
        <Text className={helperTextStyle(theme)}>{strings?.starSurveyHelperText}</Text>
      </Stack>
      <Rating
        max={5}
        size={RatingSize.Large}
        defaultRating={0}
        allowZeroStars
        rating={rating}
        onChange={onRatingChange}
        styles={ratingStyles(theme)}
        icon={selectedIcon ?? 'SurveyStarIconFilled'}
        unselectedIcon={unselectedIcon ?? 'SurveyStarIcon'}
        ariaLabelFormat={strings?.starRatingAriaLabel}
      />
      <Text className={ratingHelperTextStyle(theme)}>{ratingHelperText}</Text>
    </Stack>
  );
};
