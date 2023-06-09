// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  isUnknownIdentifier
} from '@azure/communication-common';
import { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from './identifier';

test('Communication user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('8:acs:OPAQUE');
  expect(isCommunicationUserIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'communicationUser',
    communicationUserId: '8:acs:OPAQUE'
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('8:acs:OPAQUE');
});

test('phone number conversion from E.164 format', () => {
  const parsed = fromFlatCommunicationIdentifier('+15555555555');
  expect(isPhoneNumberIdentifier(parsed)).toBeTruthy;
  expect(parsed).toEqual({
    kind: 'phoneNumber',
    phoneNumber: '+15555555555'
  });
});

test('Phone number conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('4:OPAQUE');
  expect(isPhoneNumberIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'phoneNumber',
    phoneNumber: 'OPAQUE'
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('4:OPAQUE');
});

test('Teams default user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('8:orgid:OPAQUE');
  expect(isMicrosoftTeamsUserIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'microsoftTeamsUser',
    microsoftTeamsUserId: 'OPAQUE',
    cloud: 'public',
    isAnonymous: false
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('8:orgid:OPAQUE');
});

test('Teams dod user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('8:dod:OPAQUE');
  expect(isMicrosoftTeamsUserIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'microsoftTeamsUser',
    microsoftTeamsUserId: 'OPAQUE',
    cloud: 'dod',
    isAnonymous: false
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('8:dod:OPAQUE');
});

test('Teams gcch user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('8:gcch:OPAQUE');
  expect(isMicrosoftTeamsUserIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'microsoftTeamsUser',
    microsoftTeamsUserId: 'OPAQUE',
    cloud: 'gcch',
    isAnonymous: false
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('8:gcch:OPAQUE');
});

test('Teams anonymous user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('8:teamsvisitor:OPAQUE');
  expect(isMicrosoftTeamsUserIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'microsoftTeamsUser',
    microsoftTeamsUserId: 'OPAQUE',
    isAnonymous: true
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('8:teamsvisitor:OPAQUE');
});

test('Unknown user conversions', () => {
  const parsed = fromFlatCommunicationIdentifier('OPAQUE');
  expect(isUnknownIdentifier(parsed)).toBeTruthy();
  expect(parsed).toEqual({
    kind: 'unknown',
    id: 'OPAQUE'
  });
  expect(toFlatCommunicationIdentifier(parsed)).toEqual('OPAQUE');
});
