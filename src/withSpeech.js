import React from 'react'

const Speech = React.createContext()

export class SpeechProvider extends React.Component {
	speak = async text => {
		const msg = new SpeechSynthesisUtterance(text)
		msg.voice = speechSynthesis.getVoices()[3]
		await speechSynthesis.speak(msg)
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

	render() {
		return (
			<Speech.Provider value={{ speak: this.speak }}>
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
