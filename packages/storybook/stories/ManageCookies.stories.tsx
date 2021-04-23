import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { PrimaryButton } from '@fluentui/react';

function openManageCookiesModal(): void {
  (window as any).parent.siteConsent?.manageConsent();
}

export const ManageCookies: () => JSX.Element = () => {
  const manageCookiesRequired = (window as any).parent?.siteConsent.isConsentRequired;
  const buttonText = manageCookiesRequired ? 'Manage Cookies' : 'Manage Cookies unavailable';
  return <PrimaryButton text={buttonText} onClick={openManageCookiesModal} disabled={!manageCookiesRequired} />;
};

export default {
  title: `Settings/Manage Cookies`
} as Meta;
