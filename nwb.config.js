const Dotenv = require('dotenv-webpack');
const DotenvExpand = require('dotenv-expand');
const path = require('path');

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      plugins: [
        new Dotenv({
          expand: true
        }),
      ]
    }
  },
  babel: {
    plugins: ['transform-regexp-constructors']
  }
}
