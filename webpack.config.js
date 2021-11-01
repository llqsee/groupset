


// const path = require('path');
// const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    mode: 'none',
    devtool: 'eval-source-map',
    entry: __dirname + "/main.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },



    devServer: {
        // publicPath: '/',
        contentBase: __dirname,//本地服务器所加载的页面所在的目录 
        historyApiFallback: true,//不跳转 
        inline: false,//实时刷新 
        port: 3000,
        host: 'localhost',
        compress: true,
        open: true,
        openPage: '' // <-- this
    }
}

// const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
// const path = require( 'path' );
// module.exports = {
//    context: __dirname,
//    entry: './src/index.js',
//    output: {
//       path: path.resolve( __dirname, 'dist' ),
//       filename: 'main.js',
//    },

//    plugins: [
//       new HtmlWebPackPlugin()
//    ]
// };