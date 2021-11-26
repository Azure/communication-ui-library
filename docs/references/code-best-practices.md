# Code best practices

As our team is growing and external people can contribute to our code, it's always good to have some principles around our code, so we can keep some consistency and clean code.
As we are evolving, more guidelines will be added here.

## Constants

Inside a component file, guideline for constants is as follow:
* all fixed non-localized strings, numbers, etc.. , should be:
  * capitalized,
  * added at the top (before component code).
* other constants should be at the bottom (after component code)

## Styles

For components, guideline for styles is as follow:
* styles should be in a separate file ("ComponentName.styles.ts") if one of the following conditions applied:
  * there's more than 1 style
  * style is too long
* styles depending on "theme" should be defined as functions with theme as arg, and added to the styles file.

## Accessibility

Accessibility by design is a principle across Microsoft products and as such we want our composites and UI components to be fully accessible.
To satisfy this principle, please, always test accessibility when implementing a new feature as well as when updating an existing one.
This mean at least checking keyboard navigation, zoom-in at 400% and screen reading.