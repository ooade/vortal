/**
 * Registers our Service Worker on the site
 * Need more? check out:
 * https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
 */

export function showRefreshUI(reg) {
	button.addEventListener('click', function() {
		if (!reg.waiting) {
			// Just to ensure registration.waiting is available before
			console.log('Update Found!!!')
			return
		}

		reg.waiting.postMessage('skipWaiting')
	})
}

function onNewServiceWorker(reg, callback) {
	if (reg.waiting) {
		// SW is waiting to activate. Can occur if multiple clients open and
		// one of the clients is refreshed.
		return callback()
	}

	function listenInstalledStateChange() {
		reg.installing.addEventListener('statechange', function(event) {
			if (event.target.state === 'installed') {
				// A new service worker is available, inform the user
				callback()
			}
		})
	}

	if (reg.installing) {
		return listenInstalledStateChange()
	}

	// We are currently controlled so a new SW may be found...
	// Add a listener in case a new SW is found,
	registration.addEventListener('updatefound', listenInstalledStateChange)
}

if (
	process.env.NODE_ENV === 'production' &&
	typeof window !== 'undefined' &&
	'serviceWorker' in navigator
) {
	window.addEventListener('load', function() {
		navigator.serviceWorker
			.register('/sw.js')
			.then(function(reg) {
				// Track updates to the Service Worker.
				if (!navigator.serviceWorker.controller) {
					// The window client isn't currently controlled so it's a new service
					// worker that will activate immediately
					return
				}

				// When the user asks to refresh the UI, we'll need to reload the window
				var preventDevToolsReloadLoop

				navigator.serviceWorker.addEventListener(
					'controllerchange',
					function() {
						// Ensure refresh is only called once.
						// This works around a bug in "force update on reload".
						if (preventDevToolsReloadLoop) return
						preventDevToolsReloadLoop = true
						console.log('Controller loaded')
						window.location.reload()
					}
				)

				onNewServiceWorker(reg, function() {
					showRefreshUI(reg)
				})
			})
			.catch(function(e) {
				console.error('Error during service worker registration:', e)
			})
	})
}
