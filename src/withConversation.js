import React from 'react'

const Conversation = React.createContext()

export class ConversationProvider extends React.PureComponent {
	state = {
		machine: [],
		user: [],
		log: []
	}

	addUser = text => {
		this.setState({
			user: [...this.state.user, text],
			log: [...this.state.log, { text, role: 'user' }]
		})
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

export default ComposedComponent => props => (
	<Conversation.Consumer>
		{value => <ComposedComponent conversation={value} {...props} />}
	</Conversation.Consumer>
)
