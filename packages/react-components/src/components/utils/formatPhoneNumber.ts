// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export const formatPhoneNumber = (value: string): string => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) {
    return value;
  }

  // clean the input for any non-digit values.
  let phoneNumber = value.replace(/[^\d*#+]/g, '');

  // if phone number starts with 1, format like 1 (xxx)xxx-xxxx.
  // if phone number starts with +, we format like +x (xxx)xxx-xxxx.
  // For now we are only supporting NA phone number formatting with country code +x
  // first we chop off the countrycode then we add it on when returning
  let countryCodeNA = '';
  if (phoneNumber[0] === '1') {
    countryCodeNA = '1 ';

    phoneNumber = phoneNumber.slice(1, phoneNumber.length);
  } else if (phoneNumber[0] === '+') {
    countryCodeNA = phoneNumber.slice(0, 2) + ' ';
    phoneNumber = phoneNumber.slice(2, phoneNumber.length);
  }

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code too early
  // if phoneNumberLength is greater than 10 we don't do any formatting

  if (phoneNumberLength < 4 || phoneNumberLength > 10) {
    // no formatting in this case, remove ' ' behind countrycode
    return countryCodeNA.replace(' ', '') + phoneNumber;
  }

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `${countryCodeNA}(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `${countryCodeNA}(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(
    6,
    phoneNumber.length
  )}`;
};
