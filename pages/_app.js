import React from 'react'
import Head from 'next/head'
import App, { Container } from 'next/app'

import withRoot from '../src/withRoot'

export default withRoot(
	class MyApp extends App {
		static async getInitialProps({ Component, ctx }) {
			return {
				pageProps: {
					// Call page-level getInitialProps
					...(Component.getInitialProps
						? await Component.getInitialProps(ctx)
						: {})
				}
			}
		}

		render() {
			const { Component, pageProps } = this.props
			return (
				<Container>
					<Head>
						<title>YCT Voice Portal System</title>
					</Head>
					<Component {...pageProps} />
				</Container>
			)
		}
	}
)
