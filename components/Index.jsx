import React from 'react'
import { AppBar, Button, Toolbar, Grid, Typography } from '@material-ui/core'
import { Edit, Mic } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import withRecognition from '../src/withRecognition'
import withConversation from '../src/withConversation'
import withSpeech from '../src/withSpeech'

const styles = theme => ({
	root: {
		height: '100vh'
	},
	image: {
		width: 50
	},
	toolbar: {
		color: theme.palette.primary.main,
		height: 80,
		backgroundColor: '#fff',
		borderBottom: `1px solid ${theme.palette.primary.main}`,
		'& h6': {
			fontWeight: 'bold'
		}
	},
	body: {
		height: 'calc(100% - 80px)',
		background: 'rgba(200,150,89,0.3)'
	},
	interactiveSection: {
		padding: '1rem',
		flex: '1 1 0',
		maxWidth: '100%',
		overflowY: 'auto'
	},
	bottomActionBar: {
		padding: '1rem',
		transition: 'ease 5s',
		'& button': {
			margin: '0.4rem',
			marginBottom: '3rem'
		}
	},
	userMessage: {
		display: 'flex',
		justifyContent: 'flex-end',
		transition: 'flex 500ms ease-in-out',
		'& div': {
			borderRadius: 15,
			backgroundColor: '#fff',
			border: '1px solid #ddd',
			maxWidth: '60%',
			marginTop: '1rem',
			boxShadow:
				'0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
			outline: 0,
			padding: '1rem',
			fontFamily: 'Source Sans Pro, Ubuntu'
		}
	},
	machineMessage: {
		display: 'flex',
		justifyContent: 'flex-start',
		transition: 'flex 500ms ease-in-out',
		'& div': {
			borderRadius: 15,
			backgroundColor: '#fff',
			border: '1px solid #ddd',
			maxWidth: '60%',
			marginTop: '1rem',
			boxShadow:
				'0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
			outline: 0,
			padding: '1rem',
			fontFamily: 'Source Sans Pro, Ubuntu'
		}
	},
	input: {
		height: 50,
		flex: 1,
		borderRadius: 15,
		border: '1px solid #ddd',
		boxShadow:
			'0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
		outline: 0,
		padding: '1rem'
	}
})

class Index extends React.Component {
	state = {
		inputBox: false,
		text: ''
	}

	toggleInputBox = () => {
		this.setState({ inputBox: !this.state.inputBox })
	}

	handleMicClick = () => {
		this.props.recognition.start()
	}

	handleTextChange = e => {
		this.setState({ text: e.target.value })
	}

	handleFormSubmit = e => {
		e.preventDefault()
		this.props.conversation.addUser(this.state.text)
		this.setState({ text: '' })
	}

	componentDidMount() {
		this.props.conversation.onIndexMounted()
	}

	render() {
		const { classes } = this.props

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar className={classes.toolbar}>
						<img
							className={classes.image}
							src={'../static/img/microphone.svg'}
						/>
						<Typography variant="h6" color="inherit">
							YCT Voice Portal
						</Typography>
					</Toolbar>
				</AppBar>
				<Grid container direction="column" className={classes.body}>
					<section className={classes.interactiveSection} id="chat">
						{this.props.conversation.log.map((msg, key) => (
							<div
								className={
									msg.role === 'user'
										? classes.userMessage
										: classes.machineMessage
								}
								key={key}
							>
								<div dangerouslySetInnerHTML={{ __html: msg.text }} />
							</div>
						))}
					</section>
					<Grid
						container
						className={classes.bottomActionBar}
						alignItems="center"
						justify="flex-end"
					>
						<Button variant="fab" color="primary" onClick={this.toggleInputBox}>
							<Edit />
						</Button>
						{this.state.inputBox && (
							<form onSubmit={this.handleFormSubmit}>
								<input
									type="text"
									value={this.state.text}
									autoFocus={true}
									onChange={this.handleTextChange}
									className={classes.input}
									placeholder="Type a message"
								/>
							</form>
						)}
						<Button
							variant="extendedFab"
							color="primary"
							onClick={this.handleMicClick}
						>
							<Mic />
							Click to Speak
						</Button>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default withStyles(styles)(
	withSpeech(withConversation(withRecognition(Index)))
)
