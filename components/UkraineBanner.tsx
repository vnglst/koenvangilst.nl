export default function UkraineBanner() {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.stopputin.net/"
    >
      <div className="bg-[#0066cc] text-white fixed flex items-center justify-center bottom-0 w-screen h-12 z-50">
        <span className="block md:hidden">
          <strong className="text-[#ffcc00]">Stand with Ukraine.</strong> Donate
          →
        </span>
        <span className="hidden md:block">
          <strong className="text-[#ffcc00]">Stand with Ukraine.</strong>{' '}
          Petition your leaders. Show your support.
        </span>
      </div>
    </a>
  );
}
