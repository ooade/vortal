import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import JssProvider from 'react-jss/lib/JssProvider'
import flush from 'styled-jsx/server'
import getPageContext from '../src/getPageContext'

class MyDocument extends Document {
	render() {
		const { pageContext } = this.props

		return (
			<html lang="en" dir="ltr">
				<Head>
					<meta charSet="utf-8" />
					{/* Use minimum-scale=1 to enable GPU rasterization */}
					<meta
						name="viewport"
						content={
							'user-scalable=0, initial-scale=1, ' +
							'minimum-scale=1, width=device-width, height=device-height'
						}
					/>
					<meta
						name="theme-color"
						content={pageContext.theme.palette.primary.main}
					/>
					<link rel="manifest" href="static/manifest.json" />
					<link
						href="https://fonts.googleapis.com/css?family=Source+Sans+Pro"
						rel="stylesheet"
					/>
					<link
						rel="shortcut icon"
						type="image/png"
						href="/static/favicon.png"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}

MyDocument.getInitialProps = ctx => {
	// Resolution order
	//
	// On the server:
	// 1. page.getInitialProps
	// 2. document.getInitialProps
	// 3. page.render
	// 4. document.render
	//
	// On the server with error:
	// 2. document.getInitialProps
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. page.getInitialProps
	// 3. page.render

	// Get the context of the page to collected side effects.
	const pageContext = getPageContext()
	const page = ctx.renderPage(Component => props => (
		<JssProvider
			registry={pageContext.sheetsRegistry}
			generateClassName={pageContext.generateClassName}
		>
			<Component pageContext={pageContext} {...props} />
		</JssProvider>
	))

	return {
		...page,
		pageContext,
		styles: (
			<React.Fragment>
				<style
					id="jss-server-side"
					dangerouslySetInnerHTML={{
						__html: pageContext.sheetsRegistry.toString()
					}}
				/>
				<style>
					{`html{overflow-y: hidden;}body{background:url(/static/img/bg.png)}`}
				</style>
				{flush() || null}
			</React.Fragment>
		)
	}
}

export default MyDocument
