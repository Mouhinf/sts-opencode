// Configuration Webpack pour remplacer Turbopack
module.exports = {
  // Configuration de base
  mode: 'development',
  // Désactiver certains loaders problématiques
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};