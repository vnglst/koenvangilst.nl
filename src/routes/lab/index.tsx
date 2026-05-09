import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getPosts } from '#/cms/mdx-parser'
import { Container } from '#/components/layout/Container'
import { Heading } from '#/components/content/Heading'
import { Prose } from '#/components/content/Prose'
import { ProjectBrowser } from './_components/project-browser'

const getLabPosts = createServerFn({ method: 'GET' }).handler(async () => {
  return getPosts()
})

export const Route = createFileRoute('/lab/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  loader: () => getLabPosts(),
  head: () => ({
    meta: [
      { title: 'Labs | Koen van Gilst' },
      {
        name: 'description',
        content: "Koen van Gilst's coding laboratory, a collection of coding experiments, articles, and side projects.",
      },
    ],
  }),
  component: Labs,
})

function Labs() {
  const posts = Route.useLoaderData()

  return (
    <Container>
      <Heading level={1}>Articles &amp; Experiments</Heading>
      <Prose>
        <p>
          Below, you'll find a collection of coding experiments, blog posts and side projects I've been thinkering with.
          It's a mix of educational web apps, tutorials, data visualisations and creations just for fun.
        </p>
      </Prose>
      <ProjectBrowser projects={posts} />
    </Container>
  )
}
