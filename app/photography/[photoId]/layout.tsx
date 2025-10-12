export default async function Layout({ children }) {
  return <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-slate-950">{children}</div>;
}
