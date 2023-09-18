// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { IStyle, Text, useTheme, Stack, Modal, IconButton } from '@fluentui/react';
import { Rating, RatingSize } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import { useLocale } from '../../../localization';
import {
  helperTextStyle,
  modalStyles,
  questionTextStyle,
  ratingStyles,
  titleContainerClassName
} from './StarSurvey.styles';

/**
 * Strings of {@link StarSurvey} that can be overridden.
 *
 * @public
 */
export interface StarSurveyStrings {
  /**
   * Survey question
   */
  question: string;
  /**
   * Text that's displayed after user select a star response
   */
  thankYouText: string;
  /**
   * Helper text displayed below survey question before user choose a response
   */
  helperText: string;
  /**
   * Helper text displayed below survey question after user select one star
   */
  oneStarText: string;
  /**
   * Helper text displayed below survey question after user select two star
   */
  twoStarText: string;
  /**
   * Helper text displayed below survey question after user select three star
   */
  threeStarText: string;
  /**
   * Helper text displayed below survey question after user select four star
   */
  fourStarText: string;
  /**
   * Helper text displayed below survey question after user select five star
   */
  fiveStarText: string;
}

/**
 * Styles for {@link StarSurvey} component.
 *
 * @public
 */
export interface StarSurveyStyles {
  root?: IStyle;
}

/**
 * {@link StarSurvey} types
 *
 * @public
 */
export type StarSurveyTypes  = 'overallRating' | 'audioRating' | 'videoRating' | 'ScreenshareRating'

/**
 * Props for {@link StarSurvey} component.
 *
 * @public
 */
export interface StarSurveyProps {
  /**
   * Purpose of survey, overallRating,audioRating,videoRating, or ScreenshareRating
   * @defaultvalue overallRating
   */
  type?: StarSurveyTypes;
  /**
   * Boolean value to open the survey modal
   * @defaultvalue false
   */
  showSurvey?: boolean;
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
  /** Function to send StarSurvey results*/
  onSubmitStarSurvey: (
    ratings: number,
    type: StarSurveyTypes
  ) => Promise<void>;
  /** Star survey strings */
  strings?: StarSurveyStrings;
  /** Star Survey styles */
  styles?: StarSurveyStyles;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @public
 */
export const StarSurvey = (props: StarSurveyProps): JSX.Element => {
  const strings = useLocale().strings.StarSurvey;

  const { onSubmitStarSurvey, showSurvey, selectedIcon, unselectedIcon, type } = props;

  const [rating, setRating] = useState(0);
  const [showSurveyModal, setShowSurveyModal] = useState(showSurvey);

  const [helperText, setHelperText] = useState(strings.helperText);

  useEffect(() => {
    setShowSurveyModal(showSurvey);
  }, [showSurvey]);

  const theme = useTheme();

  const onRatingChange = (ev: React.FormEvent<HTMLElement>, rating?: number | undefined): void => {
    if (rating) {
      setRating(rating);

      switch (rating) {
        case 1:
          setHelperText(strings.oneStarText);
          break;
        case 2:
          setHelperText(strings.twoStarText);
          break;
        case 3:
          setHelperText(strings.threeStarText);
          break;
        case 4:
          setHelperText(strings.fourStarText);
          break;
        case 5:
          setHelperText(strings.fiveStarText);
          break;
        default:
          break;
      }
    }
  };

  const onDismissTriggered = async (): Promise<void> => {
    await onSubmitStarSurvey(rating, type ?? 'overallRating');
    setShowSurveyModal(false);
    setRating(0);
  };

  return (
    <Modal onDismiss={onDismissTriggered} isOpen={showSurveyModal} styles={modalStyles(theme)}>
      <Stack verticalAlign="center">
        <Stack className={titleContainerClassName}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text className={questionTextStyle(theme)}>{rating !== 0 ? strings.thankYouText : strings.question}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              onClick={onDismissTriggered}
              style={{ color: theme.palette.black }}
            />
          </Stack>
          <Text className={helperTextStyle(theme)}>{helperText}</Text>
        </Stack>

        <Rating
          max={5}
          size={RatingSize.Large}
          defaultRating={0}
          allowZeroStars
          ariaLabel={strings.question}
          ariaLabelFormat="{0} of {1} stars"
          rating={rating}
          onChange={onRatingChange}
          styles={ratingStyles}
          icon={selectedIcon}
          unselectedIcon={unselectedIcon}
        />
      </Stack>
    </Modal>
  );
};
