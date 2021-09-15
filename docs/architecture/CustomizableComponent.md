# Customizable Component Design

This document outlines the design principles followed by components in UI Library that makes them easily customizable. Implementation guidelines are discussed in detail below.

## Qualities of a *delightful* Customizable UI Component

- Simple & Idiomatic
- Flexible & Forgiving
- Composable
- Consistent
- Responsive
- Observable

### Simple & Idiomatic

We should strive to keep component usage as simple as possible. Component names, props and styling should be familiar to the end user.
For example, `VideoTile` instead of `StreamTile` or `MediaTile` is a more descriptive name.

### Flexible & Forgiving

A UI component can’t enforce where and how it should be used. Each component should expose capabilities that allow it to be styled for any user experience.
For example, a `ControlBar` component should allow a user to render it horizontally or vertically and insert custom control buttons.

### Composable

An end user should be able to decompose a component to its smallest element and be able to compose new components using those elements.
Instead of being an "all-or-nothing" solution, our components should allow partial usage.

### Consistent

Given that the UI Library is built on top of Fluent UI, we will encounter users who have used Fluent UI in the past, and those who haven’t.  

We should ensure that our components:

- Utilize & Extend as much of the Fluent UI styles and controls as possible.
- Reasonably expose the properties of underlying Fluent components.  
- Use component properties/interfaces that look like Fluent UI component properties/interfaces, exposing similar functionality.

### Responsive

A responsive design is crucial to the modern web. Although responsiveness is subjective and will vary from customer to customer, our components should provide a default responsive look and feel on at least 3 standard devices namely **Phone, Tablet and Desktop**.

#### Common Media Queries for Devices

Responsiveness can be tested using Edge Dev Tools - Device Toolbar.
`Ctrl + Shift + M`

##### Desktop

```css
@media screen and (min-width: 1024px) {...}
```

##### Tablet

`iPad` can be used in Edge Device Toolbar for testing the UI on a tablet.

```css
@media screen and (min-width: 768px) and (max-width: 1024px) {...}
```

##### Phone

`Galaxy S5` can be used in Edge Device Toolbar for testing the UI on a phone.

```css
@media screen and (max-width: 640px) {...}
```

### Observable

A UI component should expose properties that allow a developer to observe events such as `buttonClicked`.

## Implementation

To implement a customizable UI component we recommend creating a component on top of FluentUI's base components and expose the ability for a user to inject custom CSS styling.

### Custom CSS Styling

The UI Library has adapted a custom styling mechanism similar to what Fluent UI uses.

Each component should expose a `styles` property that allows users to provide custom CSS rules to the `root` component and `children` components (when applicable).

Following code sample shows it's implementation.

```typescript
interface VideoTileStylesProps {
  /** Styles for the root container */
  root?: IStyle;
  /** Styles for video container */
  videoContainer?: IStyle;
  /** Styles for container overlaid on the video container */
  overlayContainer?: IStyle;
}

interface VideoTileProps {
  /** Custom styles */
  styles?: VideoTileStylesProps;
  /** ...add more props as needed */
}

function VideoTile (props: VideoTileProps): JSX.Element {
  return (
    <Stack className={mergeStyles(rootStyles, styles?.root)}>
        <Stack className={mergeStyles(videoContainerStyles, styles?.videoContainer)}>
            {renderElement}
        </Stack>
        <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>
            {children}
        </Stack>
    </Stack>
  );
};
```

**Note:**

- A component should always expose a `styles` property with at least the `root` property that allows a user to style the component root/wrapper (outer appearance of the component).

- `mergeStyles` is part of the `@fluentui/merge-styles` library. Through the use of `mergeStyles`, developers can provide default styles to the components. These styles get merged with custom `styles` provided by a user. The order in which styles are passed to the `mergeStyles` function is important. Styles should be passed to `mergeStyles` in the order of priority, where the first parameter has the lowest and the last has the hights priority.
Documentation for `mergeStyles` can be found here: <https://github.com/microsoft/fluentui/blob/master/packages/merge-styles/README.md>

- Each property inside the `styles` property must be of the type `IStyle` defined in Fluent UI. Documentation for `IStyle` can be found here: <https://developer.microsoft.com/fluentui#/controls/web/references/istyle>

### Use Fluent UI to Build New Components

Fluent UI has a rich component library and can be leveraged to build new custom components.

The following code sample shows how a custom button can be built on top of a Fluent UI `DefaultButton`

```typescript
export const CustomButton = (props: CallControlButtonProps): JSX.Element => {
  const { icon, label } = props;
  return (
    <DefaultButton
        disabled={props.disabled}
        onClick={props.onClick}
        className={mergeStyles(controlButtonStyles, props.styles?.root)}
        styles={{ flexContainer: props.styles?.flexContainer }}
        menuIconProps={props.menuIconProps}
        menuProps={props.menuProps}
    >
        {icon}
        <Stack className={mergeStyles(controlButtonLabelStyles, props.styles?.label)}>
            {props.showLabel ? label : null}
        </Stack>
    </DefaultButton>
  );
};
```

Refer to Fluent UI documentation for more components here:
<https://developer.microsoft.com/fluentui#/controls/web>
