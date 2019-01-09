import React from 'react'
import {
	AppBar,
	Button,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Toolbar,
	Grid,
	Snackbar,
	Typography
} from '@material-ui/core'
import { Edit, Mic } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import withRecognition from '../src/withRecognition'
import withConversation from '../src/withConversation'
import withSpeech from '../src/withSpeech'

const capitalize = v =>
	v
		.split('')[0]
		.toUpperCase()
		.concat(v.slice(1))

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
		marginBottom: '3rem',
		'& button': {
			margin: '0.4rem'
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
	newsContent: {
		maxWidth: '70%',
		marginTop: '1rem',
		'& > div': {
			fontFamily: 'Source Sans Pro, Ubuntu',
			marginTop: '1rem'
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
	media: {
		height: 140
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
		text: '',
		error: ''
	}

	toggleInputBox = () => {
		this.setState({ inputBox: !this.state.inputBox })
	}

	handleMicClick = () => {
		try {
			this.props.recognition.start()
		} catch (e) {
			//"Failed to execute 'start' on 'SpeechRecognition': recognition has already started."
			this.setState({
				error: capitalize(
					e.message.split(':')[1].slice(1, -1) // trim the whitespace before recognition and remove the full stop
				)
			})
		}
	}

	handleTextChange = e => {
		this.setState({ text: e.target.value })
	}

	handleFormSubmit = e => {
		e.preventDefault()
		this.props.conversation.addUser(this.state.text)
		this.setState({ text: '' })
	}

	handleClose = e => {
		this.setState({ error: '' })
	}

	componentDidMount() {
		this.props.conversation.onIndexMounted()
	}

	render() {
		const { classes } = this.props
		const { error } = this.state

		const newsContent = ({ content, bannerURL, title, id }) => (
			<Card key={id}>
				<CardActionArea>
					<CardMedia
						image={bannerURL}
						title={title}
						className={classes.media}
					/>
					<CardContent>
						<Typography variant="h6">{title}</Typography>
						<Typography component="p">{content}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		)

		const selectClassName = msg => {
			if (typeof msg.text.news !== 'undefined') {
				return classes.newsContent
			}

			if (msg.role === 'user') {
				return classes.userMessage
			}

			return classes.machineMessage
		}

		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center'
					}}
					open={error.length > 0}
					autoHideDuration={6000}
					onClose={this.handleClose}
					ContentProps={{
						'aria-describedby': 'message-id'
					}}
					message={<span id="message-id">{error}</span>}
				/>
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
							<div className={selectClassName(msg)} key={key}>
								{msg.text.news ? (
									msg.text.news.map(newsContent)
								) : (
									<div dangerouslySetInnerHTML={{ __html: msg.text }} />
								)}
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
