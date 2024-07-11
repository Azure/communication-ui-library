// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const formFactorSnippet = `
<CallComposite formFactor="mobile" />
`;

export const cssSnippet = `
html,
body,
#root {
  height: 100%;
}
`;

export const creatingTargetCalleesSnippet = `
// You will want to make sure that any flat id's are converted to CommunicationUserIdentifier or PhoneNumberIdentifier
const createTargetCallees = (targetCallees: string[]): CommunicationUserIdentifier[] => {
  return targetCallees.map((c) => fromFlatCommunicationIdentifier(c) as CommunicationUserIdentifier);
};

const createTargetCallees = useMemo(() => {
  return participantIds.map((c) => fromFlatCommunicationIdentifier(c) as PhoneNumberIdentifier);
}, [participantIds]);
`;

export const customBrandingSnippet = `
<CallComposite options={{
  branding: {
    logo: {
      url: 'https://...',
      alt: 'My company logo',
      shape: 'circle'
    },
    backgroundImage: {
      url: 'https://...'
    }
  }
}} />
`;
