import withRoot from '../src/withRoot'
import { RecognitionProvider } from '../src/withRecognition'
import { ConversationProvider } from '../src/withConversation'
import { SpeechProvider } from '../src/withSpeech'
import Index from '../components/Index'

export default withRoot(() => (
	<SpeechProvider>
		<ConversationProvider>
			<RecognitionProvider>
				<Index />
			</RecognitionProvider>
		</ConversationProvider>
	</SpeechProvider>
))
