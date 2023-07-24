const commonConfig = require('../../common/config/babel/.babelrc.js');

module.exports = {
  ...commonConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 100
        }
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: []
};

// {
//   "sourceType": "unambiguous",
//   "presets": [
//     [
//       "@babel/preset-env",
//       {
//         "targets": {
//           "chrome": 100
//         }
//       }
//     ],
//     "@babel/preset-react"
//   ],
//   "plugins": []
// }
