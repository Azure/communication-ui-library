# UI Library Component and Binding Examples 

This folder contains several small examples of ACS UI Library component and binding.

## When should I use component instead of composite

If you haven't checked our composite, we strongly recommend you take a look at our composite first. Composites are all-in-one react components which provides you a full ACS experience within several lines of code. 
Component + binding layer is aiming at more customized scenarioes - especially when:
1. You need to extract components from composite and embed them into your own app.
2. Entirely shuffle all the layouts.
3. Write you own React component based on stateful client.

Check our storybook page to see more details on (Composite vs Component)[https://azure.github.io/communication-ui-library/iframe.html?id=overview--page&viewMode=story#what-ui-artifact-is-best-for-my-project] 

## Run examples

1. Edit appsettings.json, replace `[CONNECTION STRING]` with your own connection string.
2. Run `rush build`
3. Run `rushx start`
4. Visit `localhost:3000` to check the demo page.