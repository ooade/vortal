import React from 'react'
import withSpeech from './withSpeech'

const Conversation = React.createContext()

const schoolFeesDictionary = [
	{
		key: 'computer science',
		slug: 'cs',
		value: '12,000 Naira'
	},
	{
		key: 'accounting',
		value: '20,000 Naira'
	},
	{
		key: 'business administration',
		slug: 'bam',
		value: '30,000 Naira'
	},
	{
		key: 'science lab tech',
		slug: 'slt',
		value: '20,000 Naira'
	}
]

const acceptanceFeesDictionary = [
	{
		key: 'computer science',
		slug: 'cs',
		value: '32,000 Naira'
	},
	{
		key: 'accounting',
		value: '40,000 Naira'
	},
	{
		key: 'business administration',
		slug: 'bam',
		value: '30,000 Naira'
	},
	{
		key: 'science lab tech',
		slug: 'slt',
		value: '50,000 Naira'
	}
]

export class ConversationProvider$ extends React.PureComponent {
	state = {
		machine: [],
		user: [],
		log: []
	}

	checkSchoolFees = text => {
		const fee = schoolFeesDictionary.filter(fee => {
			const match = text.match('school fee')

			if (match) {
				const key = match.input.match(fee.key)
				const slug = fee.slug ? match.input.match(fee.slug) : null

				if (key) {
					return key
				}

				return slug
			}
		})[0]

		if (fee) {
			return `${fee.key[0].toUpperCase() + fee.key.slice(1)} school fees is ${
				fee.value
			}`
		}

		return null
	}

	checkAcceptanceFees = text => {
		const fee = acceptanceFeesDictionary.filter(fee => {
			const match = text.match('acceptance fee')

			if (match) {
				const key = match.input.match(fee.key)
				const slug = fee.slug ? match.input.match(fee.slug) : null

				if (key) {
					return key
				}

				return slug
			}
		})[0]

		if (fee) {
			return `${fee.key[0].toUpperCase() +
				fee.key.slice(1)} acceptance fee is ${fee.value}`
		}

		return null
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
			case 'fuck you':
				msg = "Aww! That's harsh"
				break
			default:
				if (this.checkSchoolFees(text)) {
					msg = this.checkSchoolFees(text)
				} else if (this.checkAcceptanceFees(text)) {
					msg = this.checkAcceptanceFees(text)
				}
		}

		if (typeof msg !== 'undefined') {
			this.props.speech.speak(msg.replace(/\<br\/\>/g, ','))
			this.addMachine(msg)
		}
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
