import { CameraButtonStrings } from '../components/CameraButton';

interface LocalizationProps {
  /**
   * Specific strings overides for components.
   *
   * Values here override those provided via the locale.
   */
  strings?: LocalizationStrings;

  /**
   * Locale for strings used by the components.
   *
   * Defaults to en-us (same as the default if no LocalizationProvider is used).
   *
   * For the list of supported locales, see ...
   *
   *   pprabhu comment: These work "out of the box", i.e., we provide the translations, but they can't be overridden.
   *   The implementation should like just load a JSON value for `LocalizationStrings` instead of generating a flat list.
   */
  locale?: string;

  children?: JSX.Element[];
}

interface LocalizationStrings {
  cameraButton?: CameraButtonStrings;
  /// .. and all other components.
}

const LocalizationProvider = (props: LocalicationProps): JSX.Element => {
  /// ... implement me.
};
