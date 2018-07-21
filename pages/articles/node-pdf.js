import Layout from '../../components/layout'

import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/light'
import js from 'react-syntax-highlighter/languages/hljs/javascript'
import xml from 'react-syntax-highlighter/languages/hljs/xml'
import bash from 'react-syntax-highlighter/languages/hljs/bash'
import tomorrowNight from 'react-syntax-highlighter/styles/hljs/tomorrow-night'

registerLanguage('javascript', js)
registerLanguage('bash', bash)
registerLanguage('xml', xml)

export default () => (
  <Layout title="Blog | Koen van Gilst" menu="blog">
    <section className="creations">
      <div className="wrapper">
        <div className="project project--double">
          <h1>Generating a PDF with Express & Node.JS</h1>
          <img src="/static/screenshots/form-pdf.png" />
          <p>
            In this article you'll find a fun little tutorial of how to create a
            PDF file using a web form, Express and PDFKit. To get started it'll
            use the express generator and after completing it you'll have a
            simple web form that generates a PDF file if the user clicks on the
            button <b>Create PDF</b>. I'll also point you in the right direction
            if you want to deploy the app using{' '}
            <a href="https://zeit.co/now">Now</a>.
          </p>
        </div>

        <div className="project project--double">
          <p>First install the Express application generator:</p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`yarn global add express-generator # or use npm`}
          </SyntaxHighlighter>
          <p>Then use this to generate a basic Express app:</p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`express --view=pug form-to-pdf`}
          </SyntaxHighlighter>
          <p>
            Now go into this folder and install the dependencies using Yarn:
          </p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`cd form-to-pdf\nyarn`}
          </SyntaxHighlighter>
          <p>Next add the dependency PDFKit</p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`yarn add pdfkit`}
          </SyntaxHighlighter>
          <p>You can now start your app, using:</p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`yarn start`}
          </SyntaxHighlighter>
          <p>
            Then go to <a href="http://localhost:3000">http://localhost:3000</a>{' '}
            in your browser. You should see something like: "Welcome to
            Express".
          </p>
          <p>
            Next we're going to add our HTML using the templating engine Pug
            (formerly known as Jade). Open the file <code>views/index.pug</code>{' '}
            and replace the existing code with the following:
          </p>
          <pre>
            <code>{pugTemplate}</code>
          </pre>
          <p>
            We also want to add some styling using Bootstrap and a theme from{' '}
            <a href="https://bootswatch.com/">Bootswatch</a>. In{' '}
            <code>views/layout.pug</code> add the following link directly above
            the existing link to style.css:
          </p>
          <pre>
            <code>{bootswatchStyling}</code>
          </pre>
          <p>
            Now if you restart your app and visit{' '}
            <a href="http://localhost:3000">http://localhost:3000</a> you should
            see a nicely formatted HTML form. Next we're going to add the route
            for creating PDF files. Create the file <code>routes/pdf</code> and
            add the following code:
          </p>
          <SyntaxHighlighter language="javascript" style={tomorrowNight}>
            {expressRouter}
          </SyntaxHighlighter>
          <p>
            Then open <code>app.js</code> and require the new pdf route file
            just below the existing routes and add it as a route:
          </p>
          <SyntaxHighlighter language="javascript" style={tomorrowNight}>
            {addRoute}
          </SyntaxHighlighter>
          <p>
            Your PDF rendering Express application is now ready for use! Start
            it with:
          </p>
          <SyntaxHighlighter language="bash" style={tomorrowNight}>
            {`yarn start`}
          </SyntaxHighlighter>
          <p>
            I hope you enjoyed this tutorial and feel free to ask me any
            questions. You can find me on Twitter as{' '}
            <a href="https://twitter.com/vnglst/">@vnglst</a>.
          </p>
          <p>
            You can also deploy your own Form to PDF app using Now. It's easy
            and takes only a few seconds. Instructions can be found here:{' '}
            <a href="https://zeit.co/now">https://zeit.co/now</a>.
          </p>
          <hr />
        </div>
      </div>
    </section>
  </Layout>
)

const pugTemplate = `extends layout
block content
  .row
    .col-md-8
      h1="Create a PDF"
      form.form-horizontal.well(method="post", action="/pdf")
          .form-group
              label.col-md-2.control-label File Name
              .col-md-10
                .input-group
                  input.form-control(type="text", name="filename", placeholder="File Name")
                  .input-group-addon=".pdf"
          .form-group
              label.col-md-2.control-label Text
              .col-md-10
                textarea.form-control(name="content", placeholder="Write some text for on your PDF!")
          .form-group
              .col-sm-offset-2.col-sm-10
                input.btn.btn-default(type="submit", value="Create PDF")
`

const bootswatchStyling = `doctype html
html
  head
    title= title
    link(rel='stylesheet', href='https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/flatly/bootstrap.min.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content`

const expressRouter = `const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')

router.post('/', (req, res) => {
  const doc = new PDFDocument()
  let filename = req.body.filename
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')
  const content = req.body.content
  doc.y = 300
  doc.text(content, 50, 50)
  doc.pipe(res)
  doc.end()
})

module.exports = router
`

const addRoute = `...
var index = require('./routes/index');
var users = require('./routes/users');
var pdf = require(‘./routes/pdf’); // <-- add this line
...
app.use('/', index);
app.use('/users', users);
app.use('/pdf', pdf); // <-- add this line
...`
