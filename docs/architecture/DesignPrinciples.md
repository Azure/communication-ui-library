# Framework Design Principles

## Useful

The raison d'être of the UI framework is to provide robust, generic solutions to common UI problems in order to ease the integration of communication functionality into 3rd party applications. A good example for such a common problem is laying out video call participants with non-uniform dimensions in a grid.

## Flexible

Each component should be individually useful and composable, to enable developers to only take what they need and extend and customize as necessary. Components can be composed to create any visual layout that framework users can come up with.

## Unbiased

The UI framework is great for building a new application from ground up but it is also great to fit into **any existing architecture**. To achieve this we embrace state-of-the-art best practices:

* declarative and pure rendering
* unidirectional data flow
* strong typing
* immutability

We welcome developers to come with their own state management systems, such as Redux/Flux/MobX, and don't inhibit them when using our framework.

The basic UI framework is not tied to Azure Communication Services in any way and it can be used for any communication app. Developers can choose to use the UI framework with a communication solution of their choice, like plain WebRTC or alternative chat or calling libraries. We will provide adapter libraries, however, to make Azure Communication Services the most convenient solution to integrate.

## Customizable

Every app developer or company has their own visual style. The framework components allow rich customizations. Customization ranges from choosing own icons and color theming to how to compose components to achieve a desired layout.

## Controllable

While customizability regards the visual aspects, controllability is the equivalent for functional aspects. The UI framework fully enables developers to implement their own business logic. The developer has full control to define behavior. Richer composites may provide default behavior but the developer can always override that behavior, intercept and drop or reroute flows, or decide to use the more granular layers for full control.

## Debuggable

The UI framework is deterministic and thanks to controllability provides many hooks for the developer to analyze its behavior. The framework is easy to reason about thanks to its declarative and unidirectional nature. A change during execution time can be easily observed and debugged or logged by the developer. The framework works with popular developer tools out of the box, such as the React developer tools or Redux tools if the developer chooses a Redux architecture.

## Accessible

The framework passes accessibility tests and follows best practices so that applications built with it are accessible for users of all abilities. Equally, the framework supports internationalization and localization to serve the entire planet and not just a subset.
