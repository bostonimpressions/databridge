import { type SchemaTypeDefinition } from 'sanity';
import page from './page';
import blockContent from './blockContent';
import blockContentMinimal from './blockContentMinimal';
import sectionHeroMain from './sectionHeroMain';
import sectionHeroSubpage from './sectionHeroSubpage';
import sectionFeature from './sectionFeature';
import sectionGeneric from './sectionGeneric';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    blockContent,
    blockContentMinimal,
    sectionHeroMain,
    sectionHeroSubpage,
    sectionFeature,
    sectionGeneric,
  ],
};
