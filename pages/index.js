import withRoot from '../src/withRoot'
import { RecognitionProvider } from '../src/withRecognition'
import { ConversationProvider } from '../src/withConversation'
import Index from '../components/Index'

export default withRoot(() => (
	<ConversationProvider>
		<RecognitionProvider>
			<Index />
		</RecognitionProvider>
	</ConversationProvider>
))
