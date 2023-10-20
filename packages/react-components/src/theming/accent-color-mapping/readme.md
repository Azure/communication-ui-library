# Accent Color Mapping

This utility is used to map a single color value, to a Fluent theme.

The logic is taken from <https://github.com/microsoft/fluentui/blob/master/packages/react-components/theme-designer/src/index.ts>.

## Usage

```ts
const theme = createThemeFromAccentColor(accentColor: string /*hex string, e.g. #FF6600*/, dark: boolean = false);
```
