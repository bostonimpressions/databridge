import { sanityClient } from './sanity'

export async function getPageData(slug: string) {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      slug,
      sections
    }`,
    { slug }
  )
}
