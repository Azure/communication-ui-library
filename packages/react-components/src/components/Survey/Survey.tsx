// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, {useState, useCallback} from 'react';
import { IStyle, mergeStyles,Theme, Text, useTheme, Stack} from '@fluentui/react';

import { Rating, RatingSize, PrimaryButton, IButtonStyles, IRatingStyles} from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(Survey) */
import { useLocale } from '../../localization';

/**
 * Strings of {@link Survey} that can be overridden.
 *
 * @beta
 */
export interface SurveyStrings {
  question: string;
  thankYouText: string
  confirmButtonLabel: string;
  helperText: string;
  oneStarText: string;
  twoStarText: string;
  threeStarText: string;
  fourStarText: string;
  fiveStarText: string;
}

/**
 * Styles for {@link Survey} component.
 *
 * @beta
 */
export interface SurveyStyles {
  root?: IStyle;
}

/**
 * Props for {@link Survey} component.
 *
 * @beta
 */
export interface SurveyProps {
  strings?: SurveyStrings;
  /**  function to send survey results to calling*/
  onSubmitSurvey: (ratings: number) => Promise<void>;
  styles?: SurveyStyles;
}


/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @beta
 */
export const Survey = (props: SurveyProps): JSX.Element => {

  const strings = useLocale().strings.Survey;

  const {onSubmitSurvey} = props

  const [rating, setRating] = useState(0)

  const [helperText, setHelperText] = useState(strings.helperText)

  const buttonStyles = (theme: Theme): IButtonStyles => {
    return {
      root: {
        borderRadius: _pxToRem(2),
        margin: _pxToRem(8)
      },
      rootHovered: {
        backgroundColor: theme.palette.themePrimary,
        borderColor: theme.palette.themePrimary,
        color: theme.palette.white
      },
      rootFocused: {
        backgroundColor: theme.palette.themePrimary,
        borderColor: theme.palette.themePrimary,
        color: theme.palette.white
      },
      rootPressed: {
        backgroundColor: theme.palette.themePrimary,
        borderColor: theme.palette.themePrimary,
        color: theme.palette.white
      }
    };
  };

  const questionTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    color: theme.palette.neutralPrimary,
    paddingBottom: _pxToRem(12)
  });

  const helperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralSecondary,
    paddingBottom: _pxToRem(24)
  });

  const ratingStyles = (theme: Theme): Partial<IRatingStyles> =>{
    return {
      root:{
        marginBottom: _pxToRem(12)
      },
      ratingStar: {
       fontSize: _pxToRem(28),
       width:  _pxToRem(35),
       height:  _pxToRem(35),
      
      }
       
    }
   
    };

  const theme = useTheme();

    
    const onRatingChange = (ev: React.FormEvent<HTMLElement>, rating?: number | undefined): void => {
      if (rating){
        setRating(rating);

        switch(rating){
          case 1:
            setHelperText(strings.oneStarText)
            break;
          case 2:
            setHelperText(strings.twoStarText)
            break;
          case 3:
            setHelperText(strings.threeStarText)
            break;
          case 4:
            setHelperText(strings.fourStarText)
            break;
          case 5:
            setHelperText(strings.fiveStarText)
            break;
          default:
            break;
        }
    

      }
   
    };
  

  return (
    <Stack horizontalAlign='center'>
      <Text className={questionTextStyle(theme)}>{rating !== 0? strings.thankYouText : strings.question}</Text>
      <Text className={helperTextStyle(theme)}>{helperText}</Text>
  
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
      />

<PrimaryButton styles={buttonStyles(theme)} onClick={async () => {
              await onSubmitSurvey(rating)            
            }}>
              <span>{strings.confirmButtonLabel}</span>
            </PrimaryButton>

      


      
    </Stack>
  )
};
