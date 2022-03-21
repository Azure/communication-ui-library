# FHL - Build Speed

This file lists some unscientific speed improvements observed during the March 2022 FHL effort to speed up CI builds.

All measurements were done once (so no statistical guarnatees) and in codepspaces (so unstable measurement environment).
So.... don't trust small diffs, but order of magnitude changes should still matter.

# Codespaces

- webpack `rushx build` - 109298ms
- esbuild `rushx build` -
