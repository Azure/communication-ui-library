// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  CallComposite,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_EN_US,
  CustomCallControlButtonCallback,
  CustomCallControlButtonProps,
  CustomCallControlButtonCallbackArgs,
  CallCompositeOptions
} from '../../../src';
import { IDS } from '../../browser/common/constants';
import { isMobile } from '../lib/utils';
// eslint-disable-next-line no-restricted-imports
import { IContextualMenuItem, mergeStyles } from '@fluentui/react';
import { QueryArgs } from './QueryArgs';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';
import { VideoGalleryLayout } from '@internal/react-components';

/** @internal */
export function BaseApp(props: { queryArgs: QueryArgs; callAdapter?: CallAdapter }): JSX.Element {
  const { queryArgs, callAdapter } = props;

  console.log(`Loaded test app with args ${JSON.stringify(queryArgs)}`);

  const locale = queryArgs.useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  const rtl = !!queryArgs.rtl;
  if (queryArgs.showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  const ParticipantItemOptions = queryArgs.showParticipantItemIcon ? <MoreHorizontal20Regular /> : <></>;

  let customCallCompositeOptions = queryArgs.customCallCompositeOptions;

  if (queryArgs.useEnvironmentInfoTroubleshootingOptions) {
    customCallCompositeOptions = {
      ...customCallCompositeOptions,
      onEnvironmentInfoTroubleshootingClick: onEnvironmentInfoTroubleshootingClick
    };
  }
  if (queryArgs.usePermissionTroubleshootingActions) {
    customCallCompositeOptions = {
      ...customCallCompositeOptions,
      onPermissionsTroubleshootingClick: onPermissionsTroubleshootingClick
    };
  }

  let options: CallCompositeOptions =
    customCallCompositeOptions !== undefined
      ? customCallCompositeOptions
      : queryArgs.injectCustomButtons
        ? {
            callControls: {
              legacyControlBarExperience: true,
              onFetchCustomButtonProps,
              // Hide some buttons to keep the mobile-view control bar narrow
              devicesButton: false,
              endCallButton: false
            }
          }
        : {
            callControls: {
              legacyControlBarExperience: true
            }
          };

  if (queryArgs.newControlBarExperience) {
    options = {
      ...options,
      callControls: {
        ...(options?.callControls instanceof Object ? options?.callControls : {}),
        legacyControlBarExperience: false
      }
    };
  }

  if (queryArgs.localVideoTilePosition) {
    options = {
      ...options,
      localVideoTile: { position: queryArgs.localVideoTilePosition }
    };
  } else if (!queryArgs.localVideoTilePosition) {
    options = {
      ...options,
      localVideoTile: queryArgs.localVideoTilePosition
    };
  }

  if (queryArgs.galleryLayout) {
    options = {
      ...options,
      galleryOptions: { layout: queryArgs.galleryLayout as VideoGalleryLayout }
    };
  }

  if (queryArgs.disableAutoShowDtmfDialer !== undefined) {
    options = {
      ...options,
      disableAutoShowDtmfDialer: queryArgs.disableAutoShowDtmfDialer
    };
  }

  if (queryArgs.logo === 'square') {
    options = {
      ...options,
      branding: {
        logo: {
          url: '/images/acslogo.svg',
          alt: 'Contoso logo',
          shape: 'unset'
        }
      }
    };
  }
  if (queryArgs.logo === 'circle') {
    options = {
      ...options,
      branding: {
        logo: {
          url: '/images/elephant.jpg',
          alt: 'Contoso logo',
          shape: 'circle'
        }
      }
    };
  }
  if (queryArgs.backgroundImage) {
    options = {
      ...options,
      branding: {
        backgroundImage: {
          url: '/images/composite-background.jpg'
        }
      }
    };
  }

  return (
    <>
      {!callAdapter && 'Initializing call adapter...'}
      {callAdapter && (
        <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
          <_IdentifierProvider identifiers={IDS}>
            <CallComposite
              icons={{ ParticipantItemOptions: ParticipantItemOptions }}
              adapter={callAdapter}
              locale={locale}
              formFactor={isMobile() ? 'mobile' : 'desktop'}
              onFetchParticipantMenuItems={
                queryArgs.injectParticipantMenuItems ? onFetchParticipantMenuItems : undefined
              }
              rtl={rtl}
              options={options}
              callInvitationUrl={queryArgs.callInvitationUrl}
            />
          </_IdentifierProvider>
        </div>
      )}
    </>
  );
}

function onFetchParticipantMenuItems(): IContextualMenuItem[] {
  return [
    {
      'data-ui-id': 'test-app-participant-menu-item',
      key: 'theOneWithRedBackground',
      className: mergeStyles({ background: 'red' }),
      href: 'https://bing.com',
      text: 'I feel so blue'
    },
    {
      key: 'shareSplit',
      split: true,
      subMenuProps: {
        items: [
          { key: 'sharetotwittersplit', text: 'Share to Twitter' },
          { key: 'sharetofacebooksplit', text: 'Share to Facebook' }
        ]
      },
      text: 'Share w/ Split'
    }
  ];
}
/* eslint-disable @typescript-eslint/no-unused-vars */
const onFetchCustomButtonProps: CustomCallControlButtonCallback[] = [
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      // Some non-default icon that is already registered by the composites.
      iconName: 'ParticipantItemOptionsHovered',
      strings: {
        label: 'custom #1'
      },
      placement: 'primary'
    };
  },
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      // Some non-default icon that is already registered by the composites.
      iconName: 'NetworkReconnectIcon',
      strings: {
        label: 'custom #2'
      },
      placement: 'primary'
    };
  },
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      // Some non-default icon that is already registered by the composites.
      iconName: 'HorizontalGalleryRightButton',
      strings: {
        label: 'custom #3'
      },
      placement: 'primary'
    };
  }
];

const onPermissionsTroubleshootingClick = (permissionsState: unknown): void => {
  alert(permissionsState);
};

const onEnvironmentInfoTroubleshootingClick = (): void => alert('you are using a unsupported browser');
