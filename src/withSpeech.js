import React from 'react'

const Speech = React.createContext()

export class SpeechProvider extends React.Component {
	speak = text => {
		const msg = new SpeechSynthesisUtterance(text)
		msg.voice = speechSynthesis.getVoices()[3]
		speechSynthesis.speak(msg)
	}

	UNSAFE_componentWillMount() {
		if (typeof window !== 'undefined') {
			speechSynthesis.getVoices()
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
