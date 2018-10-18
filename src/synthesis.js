export default text => {
	if (!('speechSynthesis' in window)) {
		console.log('Browser not supported')
	} else {
		const msg = new SpeechSynthesisUtterance(text)
		window.speechSynthesis.speak(msg)
	}
}
