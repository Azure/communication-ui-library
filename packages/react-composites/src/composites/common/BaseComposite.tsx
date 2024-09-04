// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Customizer,
  LayerHost,
  mergeStyles,
  PartialTheme,
  registerIcons,
  Stack,
  Theme,
  useTheme
} from '@fluentui/react';
import { FluentThemeProvider, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { createContext, useContext } from 'react';
import { CompositeLocale, LocalizationProvider } from '../localization';
import { AvatarPersonaDataCallback } from './AvatarPersona';
import { CallCompositeIcons, CallWithChatCompositeIcons, ChatCompositeIcons, DEFAULT_COMPOSITE_ICONS } from './icons';
import { globalLayerHostStyle } from './styles/GlobalHostLayer.styles';
import { useId } from '@fluentui/react-hooks';
import { ACSAudioProvider } from './AudioProvider';
/**
 * Properties common to all composites exported from this library.
 *
 * @public
 */
export interface BaseCompositeProps<TIcons extends Record<string, JSX.Element>> {
  /**
   * Fluent theme for the composite.
   *
   * @defaultValue light theme
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Custom Icon override for the composite.
   * A JSX element can be provided to override the default icon.
   */
  icons?: TIcons;
  /**
   * Locale for the composite.
   *
   * @defaultValue English (US)
   */
  locale?: CompositeLocale;
  /**
   * Whether composite is displayed right-to-left.
   *
   * @defaultValue false
   */
  rtl?: boolean;
  /**
   * A callback function that can be used to provide custom data to Avatars rendered
   * in Composite.
   *
   * This will not affect the displayName shown in the composite.
   * The displayName throughout the composite will be what is provided to the adapter when the adapter is created.
   * will be what is provided to the adapter when the adapter is created.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;

  /**
   * A callback function that can be used to provide custom menu items for a participant in
   * participant list.
   */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
}

/**
 * A base provider {@link React.Context} to wrap components with other required providers
 * (e.g. icons, FluentThemeProvider, LocalizationProvider).
 *
 * Required providers are only wrapped once, with all other instances only passing children.
 *
 * @private
 */
export const BaseProvider = (
  props: BaseCompositeProps<CallCompositeIcons | ChatCompositeIcons | CallWithChatCompositeIcons> & {
    children: React.ReactNode;
    formFactor?: 'desktop' | 'mobile';
  }
): JSX.Element => {
  const { fluentTheme, rtl, locale } = props;

  const globalLayerHostId = useId('composite-global-hostId');

  /**
   * Pass only the children if we previously registered icons, and have previously wrapped the children in
   * FluentThemeProvider and LocalizationProvider
   */
  const alreadyWrapped = useBase();
  if (alreadyWrapped) {
    return <>{props.children}</>;
  }

  /**
   * Before registering fluent icons, we should check DEFAULT_COMPOSITE_ICONS and strip out the key value pairs where value is undefined
   */
  const iconsToRegister: { [key: string]: JSX.Element } = {};
  Object.entries(DEFAULT_COMPOSITE_ICONS).forEach(([key, value]) => {
    if (value) {
      iconsToRegister[key] = value;
    }
  });

  /**
   * We register the default icon mappings merged with custom icons provided through props
   * to ensure all icons render correctly.
   */
  registerIcons({ icons: { ...iconsToRegister, ...props.icons } });

  /**
   * We need to create one context for the AudioProvider to ensure that we only have one instance of the AudioContext.
   */
  const compositeAudioContext = new AudioContext();
  // we use Customizer to override default LayerHost injected to <body />
  // which stop polluting global dom tree and increase compatibility with react-full-screen
  const CompositeElement = (
    <FluentThemeProvider fluentTheme={fluentTheme} rtl={rtl}>
      {
        // On mobile we expect the composite to fill the device screen, hence we set a meta property to have better OOBE.
        props.formFactor === 'mobile' && <meta name="viewport" content="width=device-width" />
      }
      <Customizer scopedSettings={{ Layer: { hostId: globalLayerHostId } }}>
        <ACSAudioProvider audioContext={compositeAudioContext}>
          <WithBackgroundColor>{props.children}</WithBackgroundColor>
        </ACSAudioProvider>
      </Customizer>
      <LayerHost id={globalLayerHostId} className={mergeStyles(globalLayerHostStyle)} />
    </FluentThemeProvider>
  );
  const localizedElement = locale ? LocalizationProvider({ locale, children: CompositeElement }) : CompositeElement;
  return <BaseContext.Provider value={true}>{localizedElement}</BaseContext.Provider>;
};

/**
 * @private
 */
const BaseContext = createContext<boolean>(false);

/**
 * @private
 */
const useBase = (): boolean => useContext(BaseContext);

/**
 * @private
 * Provides a wrapper with a background color to ensure that composites always have a background color.
 * This is necessary to ensure that composites are not transparent,
 * and the background color of it's parent elements doesn't show through the composite.
 */
const WithBackgroundColor = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const theme = useTheme();
  const className = mergeStyles({
    background: theme.semanticColors.bodyBackground,
    height: '100%',
    width: '100%',
    position: 'relative'
  });
  return <Stack className={className}>{children}</Stack>;
};
