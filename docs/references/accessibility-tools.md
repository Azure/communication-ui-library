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

Our point of contact for onboarding and testing cases is Meghana Pogula from 1ES Accessibility team (contact: v-mepogu@microsoft.com).
Please contact her for any a11y questions or future onboardings.

### Testing scenarios

Our testing scenarios are currently defined in our wiki for [Chat](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22952/Chat-composite-testing-scenarios) and [Calling](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22949/Call-composite-testing-scenarios).

### A11y bugs

Bugs are filled out against our composites and can be found [here](https://skype.visualstudio.com/SPOOL/_queries/query/b2336ed4-4538-4fcc-91e2-ff30f1558ce0).

### Score card

Our compliance score can be find in this [PowerBI page](https://msit.powerbi.com/groups/me/reports/33bd51b2-8a7a-482e-9f4b-3db81d2d7b04/ReportSection74ba9f9a351a6761cadd?filter=EDCoreGradesSummary%2FPrd_Id%20eq%20%27Azure%20Communications%20Services%20UI%20Library_Web_Desktop-Web%27).

## Accessibility checklist

When contributing to this repository, please ensure that your changes are accessibility compliant, so at check the following:
* keyboard navigation: we have to ensure our composites and UI components are fully navigable through keyboard.
* zoom in at 400%: we should ensure that UI elements are not hidden when zoomed in at 400%, and if not directly visible that they are accessible through scrollbars. Keep in mind that UI elements being all directly visible is an even better experience for our users.
* screen reading: we have to ensure that all important informations and controls are read by screen readers, so people with impaired vision will not miss anything.

## Tools

There are great tools that can help us in testing a11y in our product.

Here are some very useful ones.

### Accessibity Insights

[Accessibility Insights for Web](https://accessibilityinsights.io/docs/en/web/overview/) is an browser extension working on Chrome or Edge and is a tool for developers to help them find and fix accessibility issues in their web apps and sites.
In addition to their Web version, this tool is also available for Android and Windows.

For a quick check, you can use their 'FastPass' scenario and there go through the following tools:
* 'Automated checks' for detecting some common accessibility issues 
* 'Tab stops' for checking your keyboard navigation path

Accessibility Insights for Windows can be used to test luminosity ratio of UI elements.

Find out more on this tool in our [wiki](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22932/Accessibility-Insights-Tool)

### Narrator

[Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1#ID0EBD=Windows_10) is a screen-reading app built into Windows 10 and 11.
It is used by users with impaired vision, so they can navigate apps or websites without a display or mouse to complete common tasks. It reads and interacts with what’s on the screen, like text, buttons, tabs, etc...

Narrator can easily be turn on or off by pressing 'Windows key + Ctrl + Enter'.
You can also open its settings page by pressing 'Windows key + Ctrl + N' and turn it on or off fron there.

Note that 'Narrator' key is setup by default as being 'Caps Lock' or 'Insert' key, and navigation is done through 'Tab', 'Arrow', 'Enter' and 'Escape' keys.

### High contrast

To test High Contrast, please use the High Contrast flag offered directly in your browser when it exist over any pluggins.

#### Edge

Find [Edge forced-colors flag](edge://flags/#forced-colors), enable the experiment and restart your browser.
Then open Windows High Contrast settings, turn it on and choose which HC you want to test.

#### Chrome

Find [Chrome forced-colors flag](chrome://flags/#forced-colors), enable the experiment and restart your browser.
Then open Windows High Contrast settings, turn it on and choose which HC you want to test.

#### Firefox

Firefox works with Windows High Contrast. It automatically detects if you are using a HC theme and displays everything in your HC color scheme.

Just make sure Firefox override colours only with High Contrast themes.
To check that, go on Firefox settings and click on the ‘Colours…’ button under ‘Language and Appearance’ section and make sure that 'Only with High contrast themes" option is selected for the color override.

#### Safari

You will need to use the display pane of Accessibility Display preferences and use the 'Invert colors' option.

To change these preferences, go to Apple menu > System Preferences, click on Accessibility, then Display and finally Display 

## Code examples

### Missing focus on a TextField

You will need to defined the `componentRef` prop of your `TextField` component and force the focus on this reference when the UI element is mounted.

Example in [PR #1025](https://github.com/Azure/communication-ui-library/pull/1025/files) where we defined `editTextFieldRef` and force the focus on it when the 'EditBox' component mounts.

### ContextualMenu not accessible through keyboard navigation
This might due to the use of `onClick` prop directly from the button or icon and not using the `onItemClick` prop in your `MenuProps`.

A good example can be found in the [first commit](https://github.com/Azure/communication-ui-library/pull/1025/commits/44caee79eefbbdf11fe123988975c1afd7961d07) of [PR #1025](https://github.com/Azure/communication-ui-library/pull/1025).

### Text used as UI element label not being read by the screen reader

There are 2 main options to fix this:
1. re-think your design, and instead of using a separated `Text`, use the existing label of the FluentUI component your using (like `List`, `TextField`, etc...).
1. add an id to your `Text` and use this id for the `aria-labelledby` property of your UI element.

Those 2 methods were used in [PR #1126](https://github.com/Azure/communication-ui-library/pull/1126/files).
1. in 'DisplayNameField.tsx' file, we removed the div used for `Name` label and simply used the existing `label` prop of `TextField` component. Styling can be then done through 'subComponentStyles' of its `styles` prop.
1. in 'ConfigurationScreen.tsx' file, redefined `avatar-list-label` id and use it in the following `Stack` to make it its label.

### Screen reader jumping directly on group of options

This is certainly due to the group label missing in your design and code. If a group of options has no label, the screen reader focus will jump to the group itself confusing the user.

To fix this, just add a label to your group of options.

Example in [PR #1119](https://github.com/Azure/communication-ui-library/pull/1119/files) where we added `callOptionsGroupLabel` label to the `ChoiceGroup` component in 'HomeScreen.tsx' file.

### Icons in button not respecting High Contrast theme

This often comes from the fact that an icon was defined as a child of a button instead of using directly the `onRenderIcon` prop of a FluentUI button component.

Example in [PR #883](https://github.com/Azure/communication-ui-library/pull/883/files) where, in 'StartCallButton.tsx' file, the `Icon` component was used directly as a child of `PrimaryButton` instead of being called inside the `onRenderIcon` prop.

### Missing heading tags on a page

First of all, please, use FluentUI component such as `Text` or `Label` for all isolated text you need to add in your page instead of simple `div` or `p` or `span`. This will ensure a lot of accessibility features are already taken care of.

Adding a `heading` role is then as simple as adding `role` and `aria-level` properties to your component.

Example in [PR #862](https://github.com/Azure/communication-ui-library/pull/862/files) where we are adding a `heading 1` tag to different pages by replacing `div` element with `Text` component defined with `role` being 'heading' and `aria-level` being '1'.

### Some interactive elements or contents are not visible with zoom-in at 400%
This often comes from missing `min-width` and `min-height` for you main component or stack in the page.
By adding a `min-width` and a `min-height` to it, you will ensure its scrollability and thus, even if too big at 400% to be contained in the window, all of its interactive elements or contents will be accessible.

Example in code are the `mainScreenContainerStyleDesktop` and `mainScreenContainerStyleMobile` defining those two properties for the main `div` of our Call composite.

Just beaware of wrapped `Stack` which auto defined an 'inner stack' element of size `100% + childrenGap`. You will need to add a padding of half the childrenGap size to compensate that. A ggod example can be find in 'samples\Calling\src\app\views\HomeScreen.tsx' file with its `Stack` style defined in `containerStyle`.
