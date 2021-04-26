const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const ENTRY_FILE = path.resolve(__dirname, "assets", "scripts", "main.js");
const OUTPUT_DIR = path.join(__dirname, "src", "static");

const config = {
    entry: ENTRY_FILE,
    mode: "production",
    plugins: [new MiniCssExtractPlugin({ filename: "css/styles.css" })],
    module: {
        rules: [{
            test: /\.(js)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env']
                    ]
                }
            },
        }, {
            test: /\.(scss|sass)$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                autoprefixer,
                            ]
                        },
                    },
                },
                "sass-loader"
            ]
        }]
    },
    output: {
        path: OUTPUT_DIR,
        filename: "scripts/main.js"
    }
}

module.exports = config;