import Container from 'components/Container';

export default function Credits() {
  return (
    <Container title="Credits – Koen van Gilst" description="">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Credits
        </h1>
        <div className="mb-8 text-gray-600 dark:text-gray-400">
          <p className="mb-4">
            The design and code of this website is a stripped down clone of{' '}
            <a href="https://leerob.io/" className="underline">
              Lee Robinsons personal website
            </a>{' '}
            using the following tech stack:
          </p>
          <ul className="list-inside list-disc">
            <li>Library: Preact in production</li>
            <li>Framework: Next.js</li>
            <li>Deployment: Vercel</li>
            <li>Styling: Tailwind CSS</li>
          </ul>
          <p className="mt-4">
            The source code of this website can be found{' '}
            <a
              href="https://github.com/vnglst/koenvangilst.nl"
              className="underline"
            >
              on Github
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
