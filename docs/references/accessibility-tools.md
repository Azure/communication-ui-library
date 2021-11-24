# Accessibility tools

Accessibility, being a principle across Microsoft products, should be a very important aspect to never forget during our developpement.
By keeping it in mind means that we are tring to keep our composites and UI components fully accessibile and even improve in this domain.

## Accessibility pipeline

Features can be onboarded in 1ES accessibility pipeline where they will be tested by their team every quarter following scenarios you would have previously defined.
Following testing, you will received a compliance score, and bugs will be filled out for you to fix and improve accessibility in your feature.
To onboard any new features, you will need to contact the accessibility team and prepare a demo and a list of detailed sceanrios.

Our Calling and Chat composites are already onboarded in the 1ES accessibility pipeline.
Meeting, which is still in Beta, will need to be onboarded too in the near future.

### Point of contact for 1ES Accessibility team

Our point of contact for onboarding and testing cases is **Meghana Pogula** from 1ES Accessibility team (contact: v-mepogu@microsoft.com).
Please contact her for any a11y questions or future onboardings.

### Testing scenarios

Our testing scenarios are currently defined in our wiki for [Chat](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22952/Chat-composite-testing-scenarios) and [Calling](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22949/Call-composite-testing-scenarios).

### A11y bugs

Bugs are filled out against our composites and can be found [here](https://skype.visualstudio.com/SPOOL/_queries/query/b2336ed4-4538-4fcc-91e2-ff30f1558ce0).

### Score card

Our compliance score can be find in this [PowerBI page](https://msit.powerbi.com/groups/me/reports/33bd51b2-8a7a-482e-9f4b-3db81d2d7b04/ReportSection74ba9f9a351a6761cadd?filter=EDCoreGradesSummary%2FPrd_Id%20eq%20%27Azure%20Communications%20Services%20UI%20Library_Web_Desktop-Web%27).

## Accessibility checklist

When contributing to this repository, please ensure that your changes are accessibility compliant, so at check the following:
* **keyboard navigation**: we have to ensure our composites and UI components are fully navigable through keyboard.
* **zoom in at 400%**: we should ensure that UI elements are not hidden when zoomed in at 400%, and if not directly visible that they are accessible through scrollbars. Keep in mind that UI elements being all directly visible is an even better experience for our users.
* **screen reading**: we have to ensure that all important informations and controls are read by screen readers, so people with impaired vision will not miss anything.

## Tools

There are great tools that can help us in testing a11y in our product.

Here are some very useful ones.

### Accessibity Insights

[Accessibility Insights for Web](https://accessibilityinsights.io/docs/en/web/overview/) is an browser extension working on Chrome or Edge and is a tool for developers to help them find and fix accessibility issues in their web apps and sites.
In addition to their Web version, this tool is also available for Android and Windows.

For a quick check, you can use their `FastPass` scenario and there go through the following tools:
* `Automated checks` for detecting some common accessibility issues 
* `Tab stops` for checking your keyboard navigation path

Accessibility Insights for Windows can be used to test luminosity ratio of UI elements.

Find out more on this tool in our [wiki](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22932/Accessibility-Insights-Tool)

### Narrator

[Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1#ID0EBD=Windows_10) is a screen-reading app built into Windows 10 and 11.
It is used by users with impaired vision, so they can navigate apps or websites without a display or mouse to complete common tasks. It reads and interacts with what’s on the screen, like text, buttons, tabs, etc...

Narrator can easily be turn on or off by pressing `Windows key + Ctrl + Enter`.
You can also open its settings page by pressing `Windows key + Ctrl + N` and turn it on or off fron there.

Note that `Narrator` key is setup by default as being `Caps Lock` or `Insert` key, and navigation is done through `Tab`, `Arrow`, `Enter` and `Escape` keys.

### High contrast

To test High Contrast, please use the High Contrast flag offered directly in your browser when it exist over any pluggins.

#### Edge

Go to the Edge forced-colors flag (**edge://flags/#forced-colors**), enable the experiment and restart your browser.
Then open Windows High Contrast settings, turn it on and choose which HC you want to test.

#### Chrome

Go to the Chrome forced-colors flag (**chrome://flags/#forced-colors**), enable the experiment and restart your browser.
Then open Windows High Contrast settings, turn it on and choose which HC you want to test.

#### Firefox

Firefox works with Windows High Contrast. It automatically detects if you are using a HC theme and displays everything in your HC color scheme.

Just make sure Firefox override colours only with High Contrast themes.
To check that, go on Firefox settings and click on the `Colours…` button under ‘Language and Appearance’ section and make sure that `Only with High contrast themes` option is selected for the color override.

#### Safari

You will need to use the display pane of Accessibility Display preferences and use the `Invert colors` option.

To change these preferences, go to Apple menu > System Preferences, click on Accessibility, then Display and finally Display 

