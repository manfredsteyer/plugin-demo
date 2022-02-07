process.traceDeprecation = true;
const package_json = require("./package.json");
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = (env, argv) => {
    const config = {
        entry: {
            bundle: path.resolve(__dirname, "src/index.js"),
        },
        output: {
            filename: "[name].js",
            chunkFilename: "chunks/[name].[contenthash].min.js",
            path: path.resolve(__dirname, "../mf-a/dist-b/"),
            clean: true,
            publicPath: "auto",
            //uniqueName: "patternslib",
        },
        optimization: {},
        plugins: [
            new ModuleFederationPlugin({
                name: "mf_b",
                filename: 'remote.js',
                exposes: {
                    './main': './src/bootstrap.js'
                },
                shared: {
                    jquery: {
                        singleton: true,
                        requiredVersion: package_json.dependencies["jquery"],
                    },
                },
            }),
        ],
    };

    if (process.env.NODE_ENV === "development") {
        // Add a dev server.
        config.devServer = {
            static: {
                directory: __dirname,
            },
            port: "3002",
            host: "0.0.0.0",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
        config.optimization.minimize = false;
        config.devtool = false;
        config.watchOptions = {
            ignored: ["node_modules/**", "docs/**"],
        };
    }
    return config;
};
