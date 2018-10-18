import React from 'react'
import withSpeech from './withSpeech'

const Conversation = React.createContext()

export class ConversationProvider$ extends React.PureComponent {
	state = {
		machine: [],
		user: [],
		log: []
	}

	analyzeText = text => {
		text = text.toLowerCase()
		let msg

		switch (text) {
			case 'help':
				msg =
					"Here are the list of valid commands: <br/> <br/> - Department's school fees <br/> - Latest news <br/> - Exam timetable"
				break
			case 'hey':
			case 'hi':
			case 'hello':
				msg = "Hi there! My name is Mike, it's nice meeting you"
				break
			default:
				return
		}

		this.props.speech.speak(msg.replace(/\<br\/\>/g, ','))
		this.addMachine(msg)
	}

	addUser = text => {
		if (!text) return

		this.setState(
			{
				user: [...this.state.user, text.replace(/<|>/g, '')],
				log: [
					...this.state.log,
					{ text: text.replace(/<|>/g, ''), role: 'user' }
				]
			},
			() => {
				this.analyzeText(text)
			}
		)
	}

	addMachine = text => {
		this.setState({
			machine: [...this.state.user, text],
			log: [...this.state.log, { text, role: 'machine' }]
		})
	}

	componentDidUpdate() {
		let chat = document.getElementById('chat')
		chat.scrollTop = chat.scrollHeight
	}

	render() {
		return (
			<Conversation.Provider
				value={{
					log: this.state.log,
					user: this.state.user,
					addUser: this.addUser,
					addMachine: this.addMachine,
					machine: this.state.machine
				}}
			>
				{this.props.children}
			</Conversation.Provider>
		)
	}
}

export const ConversationProvider = withSpeech(ConversationProvider$)

export default ComposedComponent => props => (
	<Conversation.Consumer>
		{value => <ComposedComponent conversation={value} {...props} />}
	</Conversation.Consumer>
)
