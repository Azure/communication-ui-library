# Avoid `vh` and `vw`

tl;dr - these are only useful when a developer controls the entire app layout. As our composites and components are embedded inside external developer's apps instead use `%` or `rem`.

## Background

`vh` and `vw` (viewport height and viewport width respectively) are units of measurements for CSS properties. They are percentages of the viewport your website is being shown in, this is typically the browser width/height or an iframe's width/height. More information: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

```css
.myclass {
   width: 50vw; /* this will set the width to be 50% of the browser width (or iframe width) */
}
```

## Why we cannot use them

`vh` and `vw` are only useful a developer knows globally how everything is positioned in a given viewport. Typically during local development in this repo our composites are size to take up the whole viewport in whatever browser they are in, so `vh` and `vw` usage might look good when testing, _however our composite won't always take up the full screen when used by end developers_. End developers can size our components and composites to be any size, and position them anywhere on their site.

As an example, if we set a width of the VideoGallery in the CallComposite to be `50vw`, this will equate to 50% of the viewport width. If the viewport was 1000px, the width would be 500px. If Contoso decides to size our composite to be 400px, the video gallery will still have a width of 500px!

Instead we should use `%` values. In the above example a size of `50%` would be more appropriate than `50vw` as this will be 50% of the parent component, not 50% of the browser viewport. In this case we should also provide a `min-width` to prevent the width going below a threshold we do not support.

For completeness, `vh` and `vw` can be used in the sample apps, or any non-npm package code inside this repo. This is because in these scenarios we do control the entire app height and width. However, to avoid confusion, we should avoid use of these completely.
