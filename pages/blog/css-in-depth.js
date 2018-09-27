import React from 'react'
import Layout from '../../components/layout'
import Article from '../../components/article'
import Mdx, { meta } from './css-in-depth.mdx'

const { date } = meta

export default () => (
  <Layout title="CSS In Depth (notes) | Koen van Gilst" menu="blog">
    <Article>
      <p className="publish-date">Published on {date} by Koen van Gilst</p>
      <Mdx />
    </Article>
  </Layout>
)
