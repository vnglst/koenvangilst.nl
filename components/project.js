export default ({ fullWidth, children }) => (
  <div className={`project ${fullWidth ? 'project--full' : ''}`}>
    {children}
  </div>
)
