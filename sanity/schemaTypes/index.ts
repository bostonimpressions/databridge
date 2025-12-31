import { type SchemaTypeDefinition } from 'sanity';
import { page } from './page';
import { blogPage } from './blogPage';
import { servicePage } from './servicePage';
import { industryPage } from './industryPage';
import blockContent from './blocks/blockContent';
import blockContentMinimal from './blocks/blockContentMinimal';
import listBlock from './blocks/listBlock';
import listItem from './blocks/listItem';
import tableBlock from './blocks/tableBlock';
import sectionMain from './sectionMain';
import sectionHeroMain from './sectionHeroMain';
import sectionHeroSubpage from './sectionHeroSubpage';
import sectionTestimonials from './sectionTestimonials';
import sectionOverview from './sectionOverview';
import sectionBanner from './sectionBanner';
import sectionFeatureList from './sectionFeatureList';
import sectionFeature from './sectionFeature';
import sectionSnapshots from './sectionSnapshots';
import sectionComparison from './sectionComparison';
import sectionCallToAction from './sectionCallToAction';
import sectionDetails from './sectionDetails';
import sectionBody from './sectionBody';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    blogPage,
    servicePage,
    industryPage,
    blockContent,
    blockContentMinimal,
    listBlock,
    listItem,
    tableBlock,
    sectionMain,
    sectionHeroMain,
    sectionHeroSubpage,
    sectionOverview,
    sectionBanner,
    sectionFeatureList,
    sectionFeature,
    sectionSnapshots,
    sectionComparison,
    sectionCallToAction,
    sectionDetails,
    sectionBody,
    sectionTestimonials,
  ],
};
