import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { PrimaryButton } from '@fluentui/react';

function openManageCookiesModal(): void {
  (window as any).parent?.siteConsent?.manageConsent();
}

export const ManageCookies: () => JSX.Element = () => {
  return <PrimaryButton text="Manage Cookies" onClick={openManageCookiesModal} />;
};

export default {
  title: `Settings/Manage Cookies`
} as Meta;
