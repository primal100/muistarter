const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      plugins: [
        new Dotenv()
      ]
    }
  }
}
