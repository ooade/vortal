import { SheetsRegistry } from 'jss'
import {
	createMuiTheme,
	createGenerateClassName
} from '@material-ui/core/styles'

// A theme with custom primary and secondary color.
// It's optional.

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
		fontFamily: [
			'Source Sans Pro',
			'Roboto',
			'Oxygen',
			'Ubuntu',
			'Cantarell',
			'Open Sans',
			'Helvetica Neue',
			'sans-serif'
		].join(',')
	},
	palette: {
		primary: {
			light: '#4c8c4a',
			main: '#1b5e20',
			dark: '#003300'
		},
		secondary: {
			light: '#ffff6b',
			main: '#fdd835',
			dark: '#c6a700'
		}
	}
})

function createPageContext() {
	return {
		theme,
		// This is needed in order to deduplicate the injection of CSS in the page.
		sheetsManager: new Map(),
		// This is needed in order to inject the critical CSS.
		sheetsRegistry: new SheetsRegistry(),
		// The standard class name generator.
		generateClassName: createGenerateClassName()
	}
}

export default function getPageContext() {
	// Make sure to create a new context for every server-side request so that data
	// isn't shared between connections (which would be bad).
	if (!process.browser) {
		return createPageContext()
	}

	// Reuse context on the client-side.
	if (!global.__INIT_MATERIAL_UI__) {
		global.__INIT_MATERIAL_UI__ = createPageContext()
	}

	return global.__INIT_MATERIAL_UI__
}
