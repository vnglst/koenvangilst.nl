import SyntaxHighlighting, {
  registerLanguage
} from 'react-syntax-highlighter/light'
import xml from 'react-syntax-highlighter/languages/hljs/xml'
import css from 'react-syntax-highlighter/languages/hljs/css'
import javascript from 'react-syntax-highlighter/languages/hljs/javascript'
import tomorrowNight from 'react-syntax-highlighter/styles/hljs/tomorrow-night'

registerLanguage('css', css)
registerLanguage('xml', xml)
registerLanguage('javascript', javascript)

export default ({ language, children }) => (
  <SyntaxHighlighting language={language} style={tomorrowNight}>
    {children.trim()}
  </SyntaxHighlighting>
)
