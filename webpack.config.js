const path = require('path');

var config = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  mode: 'production',
};

var JsLibBuild = Object.assign({}, config, {
  name: "JsLibBuild",
  entry: "./src/index.ts",
  target: "web",
  output: {
    library: "plyjs",
    libraryTarget: "umd",
    filename: 'plyjs.js',
    path: path.resolve(__dirname, './lib')
  },
});

module.exports = [
  JsLibBuild
];