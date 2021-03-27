module.exports = ({ config }) => {

  // Remove entrypoint size warning (rush build sees warnings as errors). Ideally we should use code splitting to reduce the entry point instead.
  // For more information on how this might be possible see: https://github.com/storybookjs/storybook/issues/6885
  config.performance.hints = false;

  return config;
};
