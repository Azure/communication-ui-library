# FHL - Build Speed

This file lists some unscientific speed improvements observed during the March 2022 FHL effort to speed up CI builds.

All measurements were done once (so no statistical guarnatees) and in codepspaces (so unstable measurement environment).
So.... don't trust small diffs, but order of magnitude changes should still matter.

# Codespaces (16 cores)

- webpack `rushx build` - 1m32.490s
- esbuild `rushx build` - 0m3.518s
