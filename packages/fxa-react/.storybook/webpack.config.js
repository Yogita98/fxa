/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { customizeWebpackConfig } = require('fxa-react/configs/storybooks');

module.exports = ({ config, mode }) => {
  const customConfig = customizeWebpackConfig({ config });
  customConfig.module.rules = [
    {
      test: /\.svg$/,
      use: [
        '@svgr/webpack',
        {
          loader: require.resolve('file-loader'),
          options: { name: 'static/media/[name].[hash:8].[ext]' },
        },
      ],
    },
    ...customConfig.module.rules,
  ];
  return customConfig;
};
