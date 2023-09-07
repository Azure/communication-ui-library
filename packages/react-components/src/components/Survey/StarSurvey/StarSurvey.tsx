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
 * Strings of {@link Survey} that can be overridden.
 *
 * @beta
 */
export interface StarSurveyStrings {
  question: string;
  thankYouText: string;
  confirmButtonLabel: string;
  helperText: string;
  oneStarText: string;
  twoStarText: string;
  threeStarText: string;
  fourStarText: string;
  fiveStarText: string;
}

/**
 * Styles for {@link StarSurvey} component.
 *
 * @beta
 */
export interface StarSurveyStyles {
  root?: IStyle;
}

/**
 * Props for {@link StarSurvey} component.
 *
 * @beta
 */
export interface StarSurveyProps {
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
  /**  function to send StarSurvey results*/
  onSubmitStarSurvey: (ratings: number) => Promise<void>;
  strings?: StarSurveyStrings;
  styles?: StarSurveyStyles;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @beta
 */
export const StarSurvey = (props: StarSurveyProps): JSX.Element => {
  const strings = useLocale().strings.StarSurvey;

  const { onSubmitStarSurvey, showSurvey, selectedIcon, unselectedIcon } = props;

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

  const onDismissTriggered = async () => {
    await onSubmitStarSurvey(rating);
    setShowSurveyModal(false);
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
          styles={ratingStyles(theme)}
          icon={selectedIcon}
          unselectedIcon={unselectedIcon}
        />
      </Stack>
    </Modal>
  );
};
