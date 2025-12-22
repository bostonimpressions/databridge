import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Pages (Top-level pages like Home, About, Contact, etc.)
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // Service Pages (Custom Order)
      orderableDocumentListDeskItem({
        type: 'servicePage',
        title: 'Service Pages',
        S,
        context,
        id: 'servicePage.orderable',
      }),

      // Industry Pages (Custom Order)
      orderableDocumentListDeskItem({
        type: 'industryPage',
        title: 'Industry Pages',
        S,
        context,
        id: 'industryPage.orderable',
      }),

      S.divider(),

      // Blog Pages
      S.listItem()
        .title('Blog Pages')
        .child(S.documentTypeList('blogPage').title('Blog Pages')),

      S.divider(),

      // Fallback: all other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          !['page', 'servicePage', 'industryPage', 'blogPage'].includes(
            item.getId() || ''
          )
      ),
    ]);