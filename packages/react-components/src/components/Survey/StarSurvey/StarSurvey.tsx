// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useCallback } from 'react';
import { Text, useTheme, Stack, Modal, IconButton, PrimaryButton } from '@fluentui/react';
import { Rating, RatingSize } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  confirmButtonClassName,
  helperTextStyle,
  modalStyles,
  questionTextStyle,
  ratingStyles,
  titleContainerClassName
} from './StarSurvey.styles';
import { _CallSurvey, _CallSurveyResponse } from '../SurveyTypes';
/**
 * Strings of {@link StarSurvey} that can be overridden.
 *
 * @internal
 */
export interface _StarSurveyStrings {
  /**
   * Survey question
   */
  starSurveyQuestion?: string;
  /**
   * Text that's displayed after user select a star response
   */
  starSurveyThankYouText?: string;
  /**
   * Helper text displayed below survey question before user choose a response
   */
  starSurveyHelperText?: string;
  /**
   * Helper text displayed below survey question after user select one star
   */
  starSurveyOneStarText?: string;
  /**
   * Helper text displayed below survey question after user select two star
   */
  starSurveyTwoStarText?: string;
  /**
   * Helper text displayed below survey question after user select three star
   */
  starSurveyThreeStarText?: string;
  /**
   * Helper text displayed below survey question after user select four star
   */
  starSurveyFourStarText?: string;
  /**
   * Helper text displayed below survey question after user select five star
   */
  starSurveyFiveStarText?: string;
  /**
   * Confirm Button Label
   */
  starSurveyConfirmButtonLabel?: string;
  /**
   * Aria Label for each individual star rating
   */
  starRatingAriaLabel?: string;
  /**
   * Aria Label for cancel button
   */
  cancelButtonAriaLabel?: string;
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
  /** Function to send StarSurvey results*/
  onSubmitSurvey?: (survey: _CallSurvey) => Promise<_CallSurveyResponse | undefined>;
  /** function called on confirm button click*/
  onConfirmStarSurvey?: (ratings: number) => void;
  /** Function to close star survey modal*/
  onDismissStarSurvey?: () => void;
  /** Star survey strings */
  strings?: _StarSurveyStrings;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @internal
 */
export const _StarSurvey = (props: _StarSurveyProps): JSX.Element => {
  const { onSubmitSurvey, onConfirmStarSurvey, onDismissStarSurvey, selectedIcon, unselectedIcon, strings } = props;

  const [rating, setRating] = useState(0);

  const [helperText, setHelperText] = useState(strings?.starSurveyHelperText);

  const theme = useTheme();

  const onRatingChange = useCallback(
    (ev: React.FormEvent<HTMLElement>, rating?: number | undefined): void => {
      if (rating) {
        setRating(rating);

        switch (rating) {
          case 1:
            setHelperText(strings?.starSurveyOneStarText);
            break;
          case 2:
            setHelperText(strings?.starSurveyTwoStarText);
            break;
          case 3:
            setHelperText(strings?.starSurveyThreeStarText);
            break;
          case 4:
            setHelperText(strings?.starSurveyFourStarText);
            break;
          case 5:
            setHelperText(strings?.starSurveyFiveStarText);
            break;
          default:
            break;
        }
      }
    },
    [
      strings?.starSurveyOneStarText,
      strings?.starSurveyTwoStarText,
      strings?.starSurveyThreeStarText,
      strings?.starSurveyFourStarText,
      strings?.starSurveyFiveStarText
    ]
  );

  const onDismiss = useCallback((): void => {
    if (onDismissStarSurvey) {
      onDismissStarSurvey();
    }
  }, [onDismissStarSurvey]);

  const onConfirm = useCallback(async (): Promise<void> => {
    if (onSubmitSurvey) {
      await onSubmitSurvey({
        overallRating: { score: rating }
      })
        .then(() => console.log('Survey Result submitted'))
        .catch((e) => console.log(e));
    }
    if (onConfirmStarSurvey) {
      onConfirmStarSurvey(rating);
    }
    onDismiss();
  }, [onSubmitSurvey, rating, onDismiss, onConfirmStarSurvey]);

  return (
    <Modal onDismissed={onDismiss} styles={modalStyles(theme)} isOpen>
      <Stack verticalAlign="center">
        <Stack className={titleContainerClassName}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text className={questionTextStyle(theme)}>
              {rating !== 0 ? strings?.starSurveyThankYouText : strings?.starSurveyQuestion}
            </Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              onClick={onDismiss}
              ariaLabel={strings?.cancelButtonAriaLabel}
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
          rating={rating}
          onChange={onRatingChange}
          styles={ratingStyles}
          icon={selectedIcon ?? 'SurveyStarIconFilled'}
          unselectedIcon={unselectedIcon ?? 'SurveyStarIcon'}
          ariaLabelFormat={strings?.starRatingAriaLabel}
        />
      </Stack>
      <PrimaryButton className={confirmButtonClassName} onClick={() => onConfirm()}>
        {strings?.starSurveyConfirmButtonLabel}
      </PrimaryButton>
    </Modal>
  );
};
