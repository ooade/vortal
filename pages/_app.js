import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'

import withRoot from '../src/withRoot'
import initStore from '../utils/store'

export default withRoot(
	withRedux(initStore)(
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
				const { Component, pageProps, store } = this.props
				return (
					<Container>
						<Head>
							<title>YCT Voice Portal System</title>
						</Head>
						<Provider store={store}>
							<Component {...pageProps} />
						</Provider>
					</Container>
				)
			}
		}
	)
)
