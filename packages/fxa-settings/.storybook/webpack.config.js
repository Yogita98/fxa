/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { customizeWebpackConfig } = require('fxa-react/configs/storybooks');

module.exports = ({ config, mode }) => {
  const customConfig = customizeWebpackConfig({ config });
  customConfig.module.rules = [
    ...customConfig.module.rules.map((rule) => {
      if (rule.oneOf) {
        console.log('WE HAVE ONEOF', rule.oneOf);
        return {
          oneOf: [
            {
              test: /\.s[ac]ss$/i,
              use: ['style-loader', 'css-loader', 'sass-loader'],
            },
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
            ...rule.oneOf.map((subrule) => {
              console.log('SUBRULE', subrule);
              return subrule;
            }),
          ],
        };
      }
      return rule;
    }),
  ];
  return customConfig;
};
