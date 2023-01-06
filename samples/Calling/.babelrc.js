const commonConfig = require('../../common/config/babel/.babelrc.js');

module.exports = {
  ...commonConfig,
  /**
   * retainLines is needed to maintain the lines of the comments in the output to preprocess. This will cause in the output
   * the comments assigned to their original position in the file so any linter options will be maintained on their respective node.
   *
   * this is caused by the comments being both trailing and leading to the nodes either above or below it, regardless
   * of which node it is touching on the next line.
   *
   * link to babel docs on this: https://babeljs.io/docs/en/options#retainlines
   */
  retainLines: true
};
