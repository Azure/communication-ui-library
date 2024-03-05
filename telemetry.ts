import { ApplicationInsights } from '@microsoft/applicationinsights-web';

/**
 * Check if we have the necessary cookie consent to allow the app insights library to make use of cookies
 */
export const analyticsCookieConsentObtained = (): boolean => {
  return (
    !!(window as any).siteConsent && // has telemetry library been initialized
    (!(window as any).siteConsent.isConsentRequired || // check if we need collect consent in this region
      (window as any).siteConsent.getConsent().Analytics)
  ); // check if we have consent to collect analytics telemetry
};

/**
 * Start telemetry collection and watch for cookie consent changes.
 */
export const initTelemetry = () => {
  const appInsightsInstance = startTelemetry(analyticsCookieConsentObtained());

  if (appInsightsInstance) {
    createCookieChangedCallback(appInsightsInstance);
  }
};

/**
 * Setup the window.cookieConsentChanged that is called when the cookie banner's onConsentChanged is called.
 * @param applicationInsightsInstance application instance that enables or disables appInsight's cookie manager
 */
const createCookieChangedCallback = (applicationInsightsInstance: ApplicationInsights) => {
  (window as any).cookieConsentChanged = () => {
    const analyticsCookieConsent = analyticsCookieConsentObtained();
    applicationInsightsInstance.getCookieMgr().setEnabled(analyticsCookieConsent);
  };
};

/**
 * Start app insights tracking telemetry
 * @param cookieConsent do we have consent to collect cookies for analytics purposes
 * @returns the created instance of the application insights library
 */
const startTelemetry = (cookieConsent: boolean): ApplicationInsights | undefined => {
  const instrumentationKey = process.env.TELEMETRY_INSTRUMENTATION_KEY;
  if (!instrumentationKey) {
    console.warn('No telemetry instrumentationKey provided. Telemetry collection is disabled.');
    return;
  }

  // Initialize and start collecting telemetry
  const appInsights = new ApplicationInsights({
    config: {
      disableCookiesUsage: !cookieConsent,
      instrumentationKey,
      enableAutoRouteTracking: true
    }
  });
  appInsights.loadAppInsights();

  return appInsights;
};
