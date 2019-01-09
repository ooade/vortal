import React from 'react'
import withSpeech from './withSpeech'

// @DATA
import news from '../data/news.json'
import dictionary from '../data/dictionary.json'

// @NOTE: The data analysis in this section is kinda hard coded and does not
// perform any machine learning quirks
// To do something better, extract your keys to the server and make a request
// based on user's request and do a proper machine learning analysis

// Right now, I don't know ML :(

// A new key is generated per page load and checked in case of attack
const SAFE_KEY = Math.random()
	.toString(26)
	.slice(3, -1)

const Conversation = React.createContext()

const commands =
	"Here are the list of valid commands: <br/> <br/> - Department's school fee <br/> - Department's acceptance fee <br/> - Latest news"

export class ConversationProvider$ extends React.PureComponent {
	state = {
		machine: [],
		user: [],
		log: []
	}

	checkSchoolFees = text => {
		const fee = dictionary.schoolFees.filter(fee => {
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
		const fee = dictionary.acceptanceFees.filter(fee => {
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

	checkLatestNews = text => {
		const match = text.match('latest news')

		if (match) {
			// Latest news here
			return {
				$$key: SAFE_KEY,
				news
			}
		}

		return null
	}

	analyzeText = text => {
		text = text.toLowerCase()
		let msg

		switch (text) {
			case 'help':
				msg = commands
				break
			case 'hey':
			case 'hi':
			case 'hello':
				msg = "Hi there! I'm Ruby, it's nice meeting you"
				break
			case 'hey ruby':
				msg = 'Hi there!'
				break
			case 'fuck you':
			case 'keep quiet':
			case 'keep shut':
				msg = "Aww! That's harsh"
				break
			default:
				msg = commands
		}

		if (this.checkSchoolFees(text)) {
			msg = this.checkSchoolFees(text)
		}

		if (this.checkAcceptanceFees(text)) {
			msg = this.checkAcceptanceFees(text)
		}

		if (this.checkLatestNews(text)) {
			msg = this.checkLatestNews(text)
		}

		if (typeof msg !== 'undefined') {
			if (typeof msg === 'object' && msg.$$key === SAFE_KEY) {
				// Read news
				msg.news.map(({ title, content }) => {
					this.props.speech.speak(title)
					this.props.speech.speak(content)
				})
				this.addMachine(msg)
			} else {
				this.props.speech.speak(msg.replace(/\<br\/\>/g, ','))
				this.addMachine(msg)
			}
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

	handleIndexMounted = () => {
		setTimeout(async () => {
			const welcomeMsg = "Hi, I'm Ruby! \n I'm your voice assistant"
			const instructionMsg =
				"To get started, Click on the button below that says 'Click to speak'"

			this.props.speech.speak(welcomeMsg)
			await this.addMachine(welcomeMsg)

			this.props.speech.speak(instructionMsg)
			await this.addMachine(instructionMsg)
		}, 500)
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
					machine: this.state.machine,
					onIndexMounted: this.handleIndexMounted
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
