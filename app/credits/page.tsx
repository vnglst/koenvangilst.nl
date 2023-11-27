import { Heading } from 'ui/Heading';

export const metadata = {
  title: 'Credits',
  alternates: {
    canonical: 'credits'
  }
};

export default function Credits() {
  return (
    <div className="flex flex-col justify-center items-start max-w-2xl m-auto">
      <Heading level={1}>Credits</Heading>
      <div className="mb-8 text-gray-600 dark:text-gray-400">
        <p className="mb-4">
          The code of this website is inspired by{' '}
          <a href="https://leerob.io/" className="underline">
            Lee Robinsons personal website
          </a>{' '}
          using the following tech stack:
        </p>
        <ul className="list-inside list-disc">
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
  );
}
