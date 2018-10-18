import React from 'react'
import withConversation from './withConversation'

const Recognition = React.createContext()

class RecognitionProvider$ extends React.PureComponent {
	recognition =
		typeof window !== 'undefined' && new window.webkitSpeechRecognition()

	state = {
		text: ''
	}

	componentDidMount() {
		if (!('webkitSpeechRecognition' in window)) {
			console.log('Browser not supported')
		} else {
			this.recognition.continuous = false
			this.recognition.interimResults = false
			this.recognition.lang = 'en-NG'
			let final_transcript = ''
			let error = false

			this.recognition.onstart = function() {
				console.log('...')
			}

			this.recognition.onresult = event => {
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript
					}
				}
			}

			this.recognition.onerror = function(event) {
				console.log('err')
				error = true
			}

			this.recognition.onend = e => {
				console.log('ended')
				if (!error && final_transcript) {
					this.props.conversation.addUser(final_transcript)
					final_transcript = ''
					error = false
				}
			}
		}
	}

	render() {
		return (
			<Recognition.Provider
				value={{ recognition: this.recognition, text: this.state.text }}
			>
				{this.props.children}
			</Recognition.Provider>
		)
	}
}

export const RecognitionProvider = withConversation(RecognitionProvider$)

export default ComposedComponent => props => (
	<Recognition.Consumer>
		{value => <ComposedComponent {...value} {...props} />}
	</Recognition.Consumer>
)
