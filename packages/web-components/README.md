# prprabhu-pg

An exploration of how react wrappers work with Fast Element.

### For basics:
- [stories\PropsAndAttrs](.\stories\PropsAndAttrs.stories.tsx) explores passing down properties and attributes all together using react props.
- [stories\Events](.\stories\Events.stories.tsx) explores connecting web component event with react style callback function.

### For slots:
- [stories\DefaultHtmlSlot](./stories\DefaultHtmlSlot.stories.tsx) explores the default "html" way of slotable div.
- [stories\CustomAvatarOnRender](.\stories\CustomAvatarOnRender.stories.tsx) explores rendering custom slot using react-style onRender function.
- [stories\ParentChildComponents](.\stories\ParentChildComponents.stories.tsx) explores rendering custom slot using a thin layer of child component wrapper.

### For multiple elements:
- [stories\MultipleListElements](.\stories\MultipleListElements.stories.tsx) explores rendering mutliple elements(List) in a react way.
- [stories\SingleElementEvent](.\stories\SingleElementEvent.stories.tsx) explores an alternative to [stories\MultipleListElements](.\stories\MultipleListElements.stories.tsx), which only receive the diff for changed elements.

