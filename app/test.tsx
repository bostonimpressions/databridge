import { sanityClient } from "@/lib/sanity"

export default async function Test() {
  const pages = await sanityClient.fetch('*[_type == "page"]{title, slug}')
  return (
    <pre>{JSON.stringify(pages, null, 2)}</pre>
  )
}
