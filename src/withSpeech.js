import React from 'react'

const Speech = React.createContext()

export class SpeechProvider extends React.Component {
	speak = text => {
		const msg = new SpeechSynthesisUtterance(text)
		msg.lang = 'en_GB'
		msg.voice = speechSynthesis
			.getVoices()
			.find(voice => voice.name === 'English United Kingdom')
		msg.pitch = 1

		speechSynthesis.speak(msg)
	}

	async UNSAFE_componentWillMount() {
		if (typeof window !== 'undefined') {
			await speechSynthesis.getVoices()
		}
	}

	componentDidMount() {
		if (!('speechSynthesis' in window)) {
			console.log('Browser not supported')
		}
	}

	isRecognitionOn = () => {
		speechSynthesis.cancel()
	}

	render() {
		return (
			<Speech.Provider
				value={{ speak: this.speak, isRecognitionOn: this.isRecognitionOn }}
			>
				{this.props.children}
			</Speech.Provider>
		)
	}
}

export default ComposedComponent => props => (
	<Speech.Consumer>
		{value => <ComposedComponent speech={value} {...props} />}
	</Speech.Consumer>
)
