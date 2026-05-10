// Dev-only component — only imported when import.meta.env.DEV is true
// Bundler tree-shakes this entire module (and its deps) from production builds
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

const queryPlugin = {
  name: 'Tanstack Query',
  render: <ReactQueryDevtoolsPanel />,
}

export function DevTools() {
  return (
    <TanStackDevtools
      config={{ position: 'bottom-right' }}
      plugins={[
        { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
        queryPlugin,
      ]}
    />
  )
}
