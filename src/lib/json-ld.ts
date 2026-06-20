type ArticleSchema = {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  image?: string;
};

type BreadcrumbItem = { name: string; url: string };

export function jsonLdArticle(article: ArticleSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    url: article.url,
    ...(article.image ? { image: article.image } : {}),
    author: {
      '@type': 'Person',
      name: 'Koen van Gilst',
      url: 'https://koenvangilst.nl'
    }
  };
}

export function jsonLdPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Koen van Gilst',
    url: 'https://koenvangilst.nl',
    jobTitle: 'Principal Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Rabobank'
    },
    sameAs: [
      'https://bsky.app/profile/vnglst.bsky.social',
      'https://hachyderm.io/@vnglst',
      'https://github.com/vnglst',
      'https://www.linkedin.com/in/vangilst/'
    ]
  };
}

export function jsonLdBreadcrumb(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://koenvangilst.nl${item.url}`
    }))
  };
}

export function jsonLdWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Koen van Gilst',
    url: 'https://koenvangilst.nl',
    description:
      'Innovative engineer from the Netherlands, specialising in AI, developer tooling, and building high-performing engineering teams.'
  };
}
