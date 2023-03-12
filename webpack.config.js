const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");

const getSettingsForStyles = (withModules = false) => {
  return [
    isProd ? MiniCssExtractPlugin.loader : "style-loader",
    !withModules
      ? "css-loader"
      : {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: !isProd
                ? "[path][name]__[local]"
                : "[hash:base64]",
            },
          },
        },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["autoprefixer"],
        },
      },
    },
    "sass-loader",
  ];
};

module.exports = {
  entry: path.join(srcPath, "App", "index.tsx"),
  target: !isProd ? "web" : "browserslist",

  output: {
    path: buildPath,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.module\.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: getSettingsForStyles(),
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.[tj]sx?$/,
        use: "babel-loader",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "App", "index.html"),
    }),
    !isProd && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].css",
    }),
    new TsCheckerPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: [".tsx", ".jsx", ".js", ".ts"],
    alias: {
      components: path.resolve(srcPath, "components"),
      config: path.join(srcPath, "config"),
      styles: path.join(srcPath, "styles"),
      utils: path.join(srcPath, "utils"),
      models: path.join(srcPath, "models"),
      stores: path.join(srcPath, "stores"),
      images: path.join(srcPath, "assets/images"),
      pages: path.join(srcPath, "app/pages"),
    },
  },
  devServer: {
    host: "127.0.0.1",
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
};
