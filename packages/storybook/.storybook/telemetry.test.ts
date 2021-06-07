import { analyticsCookieConsentObtained } from './telemetry';

describe('storybook telemetry util tests', () => {
  beforeEach(() => {
    // reset cookie consent window variables
    (window as any).siteConsent = undefined;
  });

  describe('test analyticsCookieConsentObtained', () => {
    test('analyticsCookieConsentObtained returns false if telemetry library is not initialized', () => {
      // set cookie consent library to uninitialized
      (window as any).siteConsent = undefined;

      const result = analyticsCookieConsentObtained();

      expect(result).toEqual(false);
    });

    test('analyticsCookieConsentObtained returns false if telemetry library is initialized but consent has not been obtained', () => {
      // set cookie consent library to uninitialized
      (window as any).siteConsent = {
        isConsentRequired: true,
        getConsent: () => ({
          Required: true,
          Analytics: false
        })
      };

      const result = analyticsCookieConsentObtained();

      expect(result).toEqual(false);
    });

    test('analyticsCookieConsentObtained returns true if telemetry library is initialized and consent has been obtained', () => {
      // set cookie consent library to uninitialized
      (window as any).siteConsent = {
        isConsentRequired: true,
        getConsent: () => ({
          Required: true,
          Analytics: true
        })
      };

      const result = analyticsCookieConsentObtained();

      expect(result).toEqual(true);
    });

    test('analyticsCookieConsentObtained returns true if telemetry library is initialized but consent is not required', () => {
      // set cookie consent library to uninitialized
      (window as any).siteConsent = {
        isConsentRequired: false,
        getConsent: () => ({
          Required: false,
          Analytics: false
        })
      };

      const result = analyticsCookieConsentObtained();

      expect(result).toEqual(true);
    });
  });
});
