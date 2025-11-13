import HeroMain from "@/components/sections/HeroMain"
import Feature from "@/components/sections/Feature"
import { getPageData } from "@/lib/getPageData"

export default async function Home() {
  // Fetch the "home" page content from Sanity
  const page = await getPageData("home")

  if (!page) return <div>Page not found</div>

  return (
    <main className="bg-zinc-50 dark:bg-black font-sans">
      {page.sections?.map((section: any, i: number) => {
        const { _type, _key, ...props } = section

        switch (_type) {
          case "sectionHeroMain":  // <-- matches your Sanity schema
            return <HeroMain key={i} {...props} />  // <-- matches your React component
          case "sectionFeature":
            return <Feature key={i} features={[props]} />
          default:
            return null
        }
      })}
    </main>
  )
}
