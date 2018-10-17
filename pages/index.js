import React from 'react'
import { AppBar, Button, Toolbar, Grid, Typography } from '@material-ui/core'
import { Edit, Mic } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import withRoot from '../src/withRoot'

const styles = theme => ({
	root: {
		height: '100vh'
	},
	toolbar: {
		color: theme.palette.primary.main,
		height: 80,
		backgroundColor: '#fff',
		'& h6': {
			fontWeight: 'bold'
		}
	},
	body: {
		height: 'calc(100% - 80px)',
		background: 'rgba(200,150,89,0.3)'
	},
	interactiveSection: {
		flex: '1 1 0'
	},
	bottomActionBar: {
		padding: '1rem',
		transition: 'ease 5s',
		'& button': {
			margin: '0.4rem'
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
		padding: '1rem',
		transition: 'flex 500ms ease-in-out'
	}
})

class Index extends React.Component {
	state = {
		inputBox: false,
		text: ''
	}

	recognition

	toggleInputBox = () => {
		this.setState({ inputBox: !this.state.inputBox })
	}

	handleMicClick = () => {
		this.recognition.start()
	}

	componentDidMount() {
		const msg = new SpeechSynthesisUtterance(
			'Welcome to YCT Voice Portal, how may I help you today?'
		)
		const voices = window.speechSynthesis.getVoices()
		msg.voice = voices[3]
		window.speechSynthesis.speak(msg)

		if (!('webkitSpeechRecognition' in window)) {
			console.log('Browser not supported')
		} else {
			this.recognition = new window.webkitSpeechRecognition()

			let recognition = this.recognition

			recognition.continuous = false
			recognition.interimResults = false

			recognition.lang = 'en-NG'
			let final_transcript = ''
			recognition.onstart = function() {
				console.log('recognition starting...')
			}

			recognition.onresult = event => {
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript
					}
				}

				this.setState({ text: final_transcript })
			}

			recognition.onerror = function(event) {
				console.log('reco err', event)
			}

			recognition.onend = function() {
				console.log('ended')
				final_transcript = ''
			}
		}
	}

	render() {
		const { classes } = this.props

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar className={classes.toolbar}>
						<Typography variant="h6" color="inherit">
							YCT Voice Portal
						</Typography>
					</Toolbar>
				</AppBar>
				<Grid container direction="column" className={classes.body}>
					<section className={classes.interactiveSection}>
						{this.state.text}
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
							<input
								type="text"
								className={classes.input}
								placeholder="Type a message"
							/>
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

export default withRoot(withStyles(styles)(Index))
