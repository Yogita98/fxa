/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { resolve } = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const allFxa = resolve(__dirname, '../../');
const importPaths = [allFxa, resolve(__dirname, '../../../node_modules')];
const additionalJSImports = {
  'fxa-react': resolve(__dirname, '../'),
  'fxa-shared': resolve(__dirname, '../../fxa-shared'),
};

const customizeWebpackConfig = ({ config, mode }) => {
  console.log(config.module.rules);
  const configOut = {
    ...config,
    resolve: {
      ...config.resolve,
      plugins: config.resolve.plugins.map((plugin) => {
        // Rebuild ModuleScopePlugin with some additional allowed paths
        if (
          plugin.constructor &&
          plugin.constructor.name === 'ModuleScopePlugin'
        ) {
          return new ModuleScopePlugin(
            [...plugin.appSrcs, ...importPaths],
            plugin.allowedFiles
          );
        }
        return plugin;
      }),
      // Register a few more extensions to resolve
      extensions: [...config.resolve.extensions, '.svg', '.scss', '.css'],
      // Add aliases to some packages shared across the project
      alias: { ...config.alias, ...additionalJSImports },
    },
    module: {
      ...config.module,
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        /*
        {
          test: /\.svg$/,
          include: [additionalJSImports['fxa-react']],
          use: [
            //'@svgr/webpack',
            {
              loader: require.resolve('file-loader'),
              options: { name: 'static/media/[name].[hash:8].[ext]' },
            },
          ],
        },
        */
        ...config.module.rules.map((rule) => {
          // Replace Storybook built-in Typescript support.
          if (rule.test && rule.test.test && rule.test.test('.tsx')) {
            return {
              test: /\.(ts|tsx)$/,
              loader: require.resolve('babel-loader'),
              options: {
                presets: [['react-app', { flow: false, typescript: true }]],
              },
            };
          }
          return rule;
        }),
      ],
    },
  };
  console.log(configOut.module.rules);
  return configOut;
};

module.exports = {
  customizeWebpackConfig,
};
