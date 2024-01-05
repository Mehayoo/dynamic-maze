import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = path.resolve()

export default {
	mode: 'development',
	entry: {
		bundle: path.resolve(__dirname, 'src/index.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name][contenthash].js',
		clean: true,
	},
	devtool: 'source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		port: 9000,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Dynamic Maze',
			filename: 'index.html',
			template: 'src/index.html',
		}),
	],
}
