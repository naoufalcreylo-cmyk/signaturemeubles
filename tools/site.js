// Content source for every JSON template / section group of the Signature Meubles theme.
// node tools/gen-templates.js writes them into theme/. Copy rules: French, no unverified claims
// (no delivery promise, guarantee, review, discount, address or manufacturing claim).
const IMG = name => `shopify://shop_images/${name}`;

// ---- Header (mega-menu imagery = real ambiance photos of products in each room) -----------------
const megaCard = (menu_title, cards) => ({ type: 'custom_card', settings: { menu_title, menu_columns: 2, promotions_width: cards.length > 1 ? 64 : 36, promotion_columns: cards.length,
  ...Object.fromEntries(cards.flatMap((c, i) => [[`promo_image_${i + 1}`, IMG(c.image)], [`heading_${i + 1}`, c.heading], [`heading_size_${i + 1}`, 'h5'], [`description_${i + 1}`, c.text ? `<p>${c.text}</p>` : ''], [`promotion_link_${i + 1}`, c.link]])) } });

const headerGroup = {
  name: 'Header', type: 'header', order: ['header'],
  sections: {
    header: { type: 'header', settings: { container: 'fixed', color_scheme: 'scheme-1', menu: 'main-menu', menu_mobile: 'menu-mobile', header_layout: 'logo-left-search-center', menu_trigger: 'hover',
      sticky_header: 'always', enable_collapse_on_scroll: true, show_sperator_line: true, customer_account_style: 'icon-only', show_social_media_icons: true, enable_language_selector: false, enable_country_selector: false,
      header_top_padding_top: 18, header_top_padding_bottom: 14, navigation_color_scheme: 'scheme-1', navigation_content_alignment: 'start', navigation_padding_top: 0, navigation_padding_bottom: 0 },
      blocks: [
        megaCard('Salons & Canapés', [{ image: 'VELART_L_01_AMBIANCE.webp', heading: 'Salons d’angle en L', text: 'En photo : VELART', link: 'shopify://collections/salons-d-angle-en-l' }, { image: 'BELLAGIO_U_01_AMBIANCE.webp', heading: 'Salons en U', text: 'En photo : BELLAGIO', link: 'shopify://collections/salons-en-u' }]),
        megaCard('Séjour & Salle à manger', [{ image: 'venora-01-ambiance.webp', heading: 'Tables à manger', text: 'En photo : VÉNORA', link: 'shopify://collections/tables-a-manger' }, { image: 'alba-01-ambiance.webp', heading: 'Chaises', text: 'En photo : ALBA', link: 'shopify://collections/chaises' }]),
        megaCard('Chambre adulte', [{ image: 'ELVIS_01_AMBIANCE.webp', heading: 'Lits adultes', text: 'En photo : KARLO', link: 'shopify://collections/lits-adultes' }]),
      ] },
  },
};

// ---- Footer ---------------------------------------------------------------------------------
const footerGroup = {
  name: 'Footer', type: 'footer', order: ['contact', 'footer'],
  sections: {
    contact: { type: 'sm-contact-band', settings: { color_scheme: 'scheme-4', logo_tone: 'light', heading: 'Une question sur un modèle ?', text: '<p>Dimensions, options, disponibilité : écrivez-nous, notre équipe vous répond.</p>', contact_label: 'Nous écrire', contact_url: 'shopify://pages/contact', padding_top: 72, padding_bottom: 48 } },
    footer: { type: 'footer', settings: { container: 'fixed', color_scheme: 'scheme-4', enable_follow_on_shop: false, show_social: true, social_button_style: 'btn--icon', enable_country_selector: false, enable_language_selector: false,
      payment_enable: true, footer_layout: 'standard', footer_bottom_menu: 'footer-legal', show_sperator_line: false, show_section_divider: true, divider_width: 'fixed', padding_top: 40, padding_bottom: 32 },
      blocks: [
        { type: 'menu', settings: { block_width: 25, heading: 'Collections', heading_size: 'h6', menu: 'footer-collections', open_default: false, show_divider: false } },
        { type: 'menu', settings: { block_width: 25, heading: 'Informations', heading_size: 'h6', menu: 'footer-informations', open_default: false, show_divider: false } },
        { type: 'newsletter', settings: { block_width: 45, heading: 'Les nouveautés par e-mail', heading_size: 'h5', newsletter_description: '<p>Inscrivez-vous pour recevoir les nouveaux modèles de Signature Meubles.</p>', newsletter_term: '<p>Désinscription possible à tout moment.</p>', newsletter_text_alignment: 'left', form_width: 460, button_style: 'btn--primary', button_icon: 'arrow-right', order_first: false } },
      ] },
  },
};

// ---- Overlay --------------------------------------------------------------------------------
const overlayGroup = {
  name: 'Overlay group', type: 'custom.overlay', order: ['cart-drawer', 'quick-view', 'whatsapp'],
  sections: {
    'cart-drawer': { type: 'cart-drawer', settings: { show_cart_note: false, show_shipping_rates_calculator: false, show_cart_coupon: false, show_free_shipping_goal: false, enable_cart_recommendations: true, cart_recommendations_color_scheme: 'scheme-2',
      cart_recommendations_heading: 'Vous aimerez aussi', cart_recommendations_limit: 3, cart_recommendations_layout: 'horizontal-list', cart_mess_color_scheme: 'scheme-2', cart_message: '', cart_message_alignment: 'center' } },
    'quick-view': { type: 'quick-view', settings: { show_image_border: false, enable_sticky_info: true, enable_video_looping: false },
      blocks: [{ type: 'title', id: 'title', settings: { heading_size: 'h3' } }, { type: 'price', id: 'price' }, { type: 'variant_picker', id: 'variant_picker', settings: { picker_type: 'button', button_style: 'normal' } }, { type: 'buy_buttons', id: 'buy_buttons', settings: { show_quantity_selector: true, show_dynamic_checkout: false, show_gift_card_recipient: false } }] },
    whatsapp: { type: 'sm-whatsapp-floating', settings: { message: 'Bonjour Signature Meubles, j’ai une question.' } },
  },
};

// ---- Templates ------------------------------------------------------------------------------
const index = { sections: {
  hero: { type: 'sm-hero', settings: { color_scheme: 'scheme-4', image: IMG('VELART_L_01_AMBIANCE.webp'), image_alt: 'Salon d’angle VELART aux formes arrondies dans un séjour lumineux', image_position: 'right', show_frame: true,
    featured_product: 'velart-l', show_caption: true, caption_label: 'En photo', eyebrow: 'Tout commence à la maison', heading: 'Des pièces qui donnent du caractère à votre intérieur.', heading_tag: 'h2',
    text: '<p>Salons d’angle et en U, tables à manger, chaises et lits : chaque modèle est présenté avec ses dimensions et son prix TTC.</p>', button_label: 'Découvrir la collection', button_link: 'shopify://collections/all', link_label: 'Voir les salons', link_url: 'shopify://collections/salons-et-canapes' } },
  rooms: { type: 'sm-room-index', settings: { color_scheme: 'scheme-1', eyebrow: 'Par pièce', heading: 'Composez chaque pièce de la maison', link_label: 'Toute la collection', link_url: 'shopify://collections/all', padding_top: 96, padding_bottom: 64 },
    blocks: [
      { type: 'room', settings: { collection: 'salons-et-canapes', title: 'Salons & Canapés', subcollections: ['salons-d-angle-en-l', 'salons-en-u', 'salons-marocains', 'canapes', 'fauteuils', 'poufs'], image: IMG('SKY_GM_U_02.webp') } },
      { type: 'room', settings: { collection: 'sejour-et-salle-a-manger', title: 'Séjour & Salle à manger', subcollections: ['tables-a-manger', 'chaises', 'tables-basses', 'buffets', 'consoles', 'meubles-tv', 'etageres'], image: IMG('venora-02-face.webp') } },
      { type: 'room', settings: { collection: 'chambre-adulte', title: 'Chambre adulte', subcollections: ['lits-adultes', 'matelas'], image: IMG('ELVIS_02_FACE.webp') } },
    ] },
  selection: { type: 'featured-collection', settings: { container: 'fixed', color_scheme: 'scheme-1', section_header_alignment: 'left', subheading: 'Sélection', heading: 'Nos modèles du moment', heading_size: 'h2', description: '',
    button_label: 'Voir toute la collection', button_link: 'shopify://collections/all', button_style: 'btn--underline', limit: 8, columns: 4, column_gap: 'small', row_gap: 'inherit', enable_slider: true, content_overflow: false, navigation_position: 'bottom', pcard_image_ratio: '1/1', columns_mobile: '1', swipe_on_mobile: true, show_progress_bar: true, padding_top: 32, padding_bottom: 96 },
    blocks: [{ type: 'collection', settings: { collection: 'la-selection', title: 'Sélection' } }] },
  shapes: { type: 'sm-shape-guide', settings: { color_scheme: 'scheme-2', eyebrow: 'Bien choisir son salon', heading: 'En L ou en U ?', text: '<p>Deux formes, deux façons d’habiter le séjour. Mesurez la pièce, puis comparez les dimensions indiquées sur chaque fiche.</p>', padding_top: 96, padding_bottom: 96 },
    blocks: [
      { type: 'shape', settings: { collection: 'salons-d-angle-en-l', plan: 'l', title: 'Le salon d’angle en L', text: '<p>Il s’installe contre deux murs et dégage le centre de la pièce. Une solution qui s’adapte aux séjours de taille moyenne comme aux grands espaces.</p>', image: IMG('BELLAGIO_L_03.webp'), button_label: 'Voir les salons en L' } },
      { type: 'shape', settings: { collection: 'salons-en-u', plan: 'u', title: 'Le salon en U', text: '<p>Il entoure la table basse et réunit toute la famille face à face. Il demande davantage de place : vérifiez les trois côtés.</p>', image: IMG('SKY_IS_THE_LIMIT_U_02.webp'), button_label: 'Voir les salons en U' } },
    ] },
  dining: { type: 'sm-room-builder', settings: { color_scheme: 'scheme-1', image: IMG('venora-01-ambiance.webp'), image_alt: 'Table à manger VÉNORA dressée dans une salle à manger', image_position: 'left', eyebrow: 'Salle à manger',
    heading: 'Composez votre table', text: '<p>Choisissez d’abord la table selon le nombre de convives et la place disponible, puis associez les chaises.</p>', button_label: '', button_link: '', padding_top: 32, padding_bottom: 96 },
    blocks: [
      { type: 'step', settings: { collection: 'tables-a-manger', title: 'La table', limit: 6 } },
      { type: 'step', settings: { collection: 'chaises', title: 'Les chaises', limit: 6 } },
    ] },
  bedroom: { type: 'image-with-text', settings: { container: 'fixed', color_scheme: 'scheme-3', image: IMG('MURANO_01_AMBIANCE.webp'), image_position: 'right', image_width: 55, desktop_content_position: 'center', desktop_content_alignment: 'left', mobile_content_alignment: 'inherit', padding_top: 0, padding_bottom: 0 },
    blocks: [
      { type: 'subheading', settings: { subheading: 'Chambre adulte' } },
      { type: 'heading', settings: { heading: 'Un lit à la mesure de la chambre', heading_size: 'h2' } },
      { type: 'text', settings: { text: '<p>Du 90 × 200 au 200 × 200 cm, avec ou sans rangement selon les modèles : chaque fiche détaille les tailles proposées et le prix de chacune.</p>', subtext_color: true } },
      { type: 'button', settings: { button_label: 'Voir les lits', button_link: 'shopify://collections/lits-adultes', button_style: 'btn--primary', button_icon: 'none' } },
    ] },
  brand: { type: 'sm-brand', settings: { color_scheme: 'scheme-1', logo_tone: 'dark', tagline: 'Tout commence à la maison', eyebrow: 'La maison', heading: 'Signature Meubles',
    text: '<p>Nous réunissons des salons, des tables à manger, des chaises et des lits pensés pour la vie de tous les jours. Chaque modèle est présenté avec ses dimensions et son prix TTC, pour choisir sereinement la pièce qui trouvera sa place chez vous.</p>',
    link_label: 'En savoir plus', link_url: 'shopify://pages/a-propos', padding_top: 112, padding_bottom: 64 } },
  services: { type: 'sm-services', settings: { color_scheme: 'scheme-1', heading: '', padding_top: 32, padding_bottom: 96 },
    blocks: [
      { type: 'item', settings: { icon: 'ruler', title: 'Dimensions détaillées', text: '<p>Chaque fiche indique les dimensions du modèle et de toutes ses variantes.</p>' } },
      { type: 'item', settings: { icon: 'tag', title: 'Prix TTC en dirhams', text: '<p>Les prix affichés incluent les taxes.</p>' } },
      { type: 'item', settings: { icon: 'whatsapp', title: 'Conseil sur WhatsApp', text: '<p>Une question sur un modèle ? Écrivez-nous directement.</p>', link_label: 'Démarrer la conversation', requires_whatsapp: true, whatsapp_message: 'Bonjour Signature Meubles, j’aimerais un conseil.' } },
      { type: 'item', disabled: true, settings: { icon: 'truck', title: 'Livraison', text: '<p>À compléter avec vos conditions de livraison confirmées (zones, délais, tarifs).</p>' } },
      { type: 'item', disabled: true, settings: { icon: 'tools', title: 'Montage', text: '<p>À compléter si le montage est proposé (conditions confirmées).</p>' } },
    ] },
}, order: ['hero', 'rooms', 'selection', 'shapes', 'dining', 'bedroom', 'brand', 'services'] };

const product = { sections: {
  breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', text_alignment: 'start', padding_top: 16, padding_bottom: 16 } },
  main: { type: 'main-product', settings: { color_scheme: 'scheme-1', use_color_scheme_in_container: false, enable_sticky_info: true, media_size: 'large', gallery_layout: 'vertical-carousel', mobile_thumbnails: 'show', show_image_border: false, enable_image_zoom: true, enable_video_looping: false, padding_top: 0, padding_bottom: 72 },
    blocks: [
      { type: 'badges', id: 'badges', settings: { show_soldout_badge: true, show_sale_badge: true, sale_badge_type: 'percentage' } },
      { type: 'title', id: 'title', settings: { heading_size: 'h2' } },
      { type: 'price', id: 'price' },
      { type: 'variant_picker', id: 'variant_picker', settings: { picker_type: 'button', swatch_type: 'color_swatch', swatch_style: 'square', swatch_size: 32, button_style: 'normal', size_title: '', size_chart_from_page: '' } },
      { type: 'buy_buttons', id: 'buy_buttons', settings: { show_quantity_selector: true, show_dynamic_checkout: false, show_gift_card_recipient: false } },
      { type: 'sm_whatsapp', id: 'whatsapp', settings: { label: 'Demander conseil sur WhatsApp' } },
      { type: 'sm_specs', id: 'specs', settings: { heading: 'Caractéristiques', show_type: true, show_options: true, delivery_text: '', show_ttc_note: true } },
      { type: 'description', id: 'description' },
      { type: 'meta', id: 'meta', settings: { show_vendor: false, show_product_type: false, show_sku: true, show_barcode: false } },
      { type: 'complementary', id: 'complementary', settings: { block_heading: 'À associer', heading_size: 'h5', show_below_product_media: false, make_collapsible_row: false, icon: 'none', product_list_limit: 4, layout: 'horizontal-list', columns: 2, image_ratio: '1/1', enable_quick_add: false } },
      { type: 'social_sharing', id: 'share' },
      { type: 'sticky-atc-bar', id: 'sticky', settings: { visibility: 'mobile', style: 'minimalist', container: 'full', show_atc_button: true, show_dynamic_checkout_buttons: false, show_quantity: false } },
    ] },
  related: { type: 'related-products', settings: { container: 'fixed', color_scheme: 'scheme-1', section_header_alignment: 'left', subheading: 'Dans le même esprit', heading: 'Vous aimerez aussi', heading_size: 'h3', limit: 8, columns: 4, column_gap: 'small', enable_slider: true, navigation_position: 'bottom', pcard_image_ratio: '1/1', columns_mobile: '1', swipe_on_mobile: true, show_progress_bar: true, padding_top: 48, padding_bottom: 72, show_section_divider: true } },
  recent: { type: 'recently-viewed-products', settings: { heading: 'Récemment consultés', heading_size: 'h3', subheading: '' } },
}, order: ['breadcrumbs', 'main', 'related', 'recent'] };

const collection = { sections: {
  breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', text_alignment: 'start', padding_top: 16, padding_bottom: 0 } },
  banner: { type: 'main-collection-banner', settings: { container: 'fixed', color_scheme: 'scheme-1', text_alignment: 'left', show_collection_image: false, image_overlay_opacity: 0, image_position: 'right', image_height: 'extra-small', padding_top: 8, padding_bottom: 0 },
    blocks: [{ type: 'collection_info', settings: { heading_size: 'h1', heading_tag: 'h1', show_description: true, padding_top: 24, padding_bottom: 24 } }] },
  grid: { type: 'main-collection-product-grid', settings: { container: 'fixed', color_scheme: 'scheme-1', products_per_page: 24, columns_desktop: 3, column_gap: 'small', row_gap: 'large', pagination: 'number', enable_filtering: true, enable_color_swatch: false,
    filter_type: 'drawer', expand_filter_groups: '', enable_sorting: true, enable_layout_switching: false, columns_mobile: '2', padding_top: 8, padding_bottom: 96, show_section_divider: false } },
}, order: ['breadcrumbs', 'banner', 'grid'] };

const listCollections = { sections: {
  breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', padding_top: 16, padding_bottom: 0 } },
  main: { type: 'main-list-collections', settings: { container: 'fixed', sort: 'products_high', section_header_alignment: 'left', title: 'Toutes nos collections', heading_size: 'h1', card_color_scheme: 'scheme-2', card_style: 'card', card_heading_size: 'h6', card_image_ratio: '4/3', card_image_width: 'full', rounded_card_image: false, card_show_border: false, collections_per_page: 24, columns_desktop: 4, column_gap: 'small', row_gap: 'inherit', grid_bordered: false, columns_mobile: '2', padding_top: 24, padding_bottom: 96 } },
}, order: ['breadcrumbs', 'main'] };

const cart = { sections: {
  breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', padding_top: 16, padding_bottom: 0 } },
  main: { type: 'main-cart', settings: { container: 'fixed', padding_top: 32, padding_bottom: 96 }, blocks: [{ type: 'subtotal', id: 'subtotal' }, { type: 'buttons', id: 'buttons' }, { type: 'cart_note', id: 'note' }] },
}, order: ['breadcrumbs', 'main'] };

const search = { sections: { main: { type: 'main-search', settings: { container: 'fixed', color_scheme: 'scheme-1', products_per_page: 24, columns_desktop: 4, column_gap: 'small', row_gap: 'large', pagination: 'number', enable_filtering: true, filter_type: 'drawer', enable_sorting: true, enable_layout_switching: false, show_tags: false, show_excerpt: false, show_date: false, show_author: false, columns_mobile: '2', padding_top: 32, padding_bottom: 96 } } }, order: ['main'] };

const page = { sections: { main: { type: 'main-page', settings: { container: 'narrow', text_alignment: 'left', padding_top: 48, padding_bottom: 96 } } }, order: ['main'] };

const pageAbout = { sections: {
  main: { type: 'main-page', settings: { container: 'narrow', text_alignment: 'left', padding_top: 48, padding_bottom: 24 } },
  brand: { ...index.sections.brand, settings: { ...index.sections.brand.settings, link_label: '', link_url: '', padding_top: 48, padding_bottom: 72, image: IMG('LOFT_L_01_AMBIANCE.webp'), image_alt: 'Salon d’angle LOFT en velours ocre' } },
  rooms: { ...index.sections.rooms, settings: { ...index.sections.rooms.settings, eyebrow: 'Nos collections', heading: 'Ce que vous trouverez chez nous', padding_top: 48 } },
}, order: ['main', 'brand', 'rooms'] };

const pageContact = { sections: {
  breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', padding_top: 16, padding_bottom: 0 } },
  main: { type: 'main-page', settings: { container: 'narrow', text_alignment: 'left', padding_top: 32, padding_bottom: 0 } },
  form: { type: 'contact-form', settings: { container: 'fixed', section_color_scheme: 'scheme-1', heading: 'Écrivez-nous', heading_size: 'h3', padding_top: 32, padding_bottom: 96 },
    blocks: [{ type: 'custom_field', settings: { field_type: 'select', heading: 'Votre demande concerne', placeholder: '', required: false, full_width: true, select_options: 'Un salon, Une table ou des chaises, Un lit, Une commande, Autre' } }] },
}, order: ['breadcrumbs', 'main', 'form'] };

const notFound = { sections: {
  main: { type: 'main-404', settings: {} },
  rooms: { ...index.sections.rooms, settings: { ...index.sections.rooms.settings, eyebrow: 'Continuer la visite', heading: 'Par où commencer ?', link_label: '', padding_top: 24 } },
}, order: ['main', 'rooms'] };

const password = { layout: 'password', sections: { main: { type: 'main-password', settings: { heading: 'Ouverture prochaine', text: '<p>La boutique en ligne Signature Meubles ouvre bientôt. Laissez votre e-mail pour être informé de son lancement.</p>', show_newsletter: true, show_socials: true, show_footer: true } } }, order: ['main'] };
const blog = { sections: { breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', padding_top: 16, padding_bottom: 0 } }, main: { type: 'main-blog', settings: {} } }, order: ['breadcrumbs', 'main'] };
const article = { sections: { breadcrumbs: { type: 'breadcrumbs', settings: { container: 'fixed', padding_top: 16, padding_bottom: 0 } }, main: { type: 'main-article', settings: {} } }, order: ['breadcrumbs', 'main'] };

module.exports = { groups: { 'header-group': headerGroup, 'footer-group': footerGroup, 'overlay-group': overlayGroup },
  templates: { index, product, collection, 'list-collections': listCollections, cart, search, page, 'page.about': pageAbout, 'page.contact': pageContact, '404': notFound, password, blog, article } };
