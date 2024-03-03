/** Loading indication when loading ArcGIS JavaScript bundle */
export function LoadingMap() {
  return (
    <div className="fixed inset-0 flex">
      <div className="m-auto h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 md:h-32 md:w-32 dark:border-white" />
    </div>
  );
}
