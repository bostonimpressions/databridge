import { type SchemaTypeDefinition } from 'sanity'
import page from './page'
import blockContent from './blockContent'
import blockContentMinimal from './blockContentMinimal'
import sectionHeroMain from './sectionHeroMain'
import sectionFeature from './sectionFeature'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [page, blockContent, blockContentMinimal, sectionHeroMain, sectionFeature],
}
