import './styling/creations.css'

const Creations = ({ children }) => (
  <section className="creations">{children}</section>
)

const Item = ({ fullWidth, children }) => (
  <div className={`project ${fullWidth ? 'project--full' : ''}`}>
    {children}
  </div>
)

Creations.Item = Item

export default Creations
