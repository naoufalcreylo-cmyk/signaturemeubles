// node tools/gen-settings.js — writes theme/config/settings_data.json « current » = Signature Meubles design system.
// Presets shipped by Hyper are kept untouched so the merchant can still switch back.
const fs = require('fs');
const F = 'theme/config/settings_data.json';
const data = JSON.parse(fs.readFileSync(F, 'utf8'));
const base = data.presets.Hyper;

// Palette — derived from the vector logo (forêt #24351B, bronze #A07007) and the studio photo backdrop (#EEE6DF)
const P = { ivoire: '#f6f2ec', lin: '#eee6df', linDeep: '#e5dbd0', sable: '#e7ded1', taupe: '#6e655a', charbon: '#1f211c', foret: '#24351b', foretDeep: '#1c2a15', foretSoft: '#2e4224', bronze: '#a07007', bronzeLight: '#c9a35a', trait: '#ddd3c6', traitDark: '#435638', blanc: '#ffffff', terre: '#8a3b22' };
const scheme = o => ({ settings: { primary_accent: P.foret, border: P.trait, text: P.charbon, subtext: P.taupe, background: P.ivoire, secondary_background: P.lin, button: P.foret, button_label: P.ivoire, secondary_button: P.ivoire, secondary_button_border: P.charbon, secondary_button_label: P.charbon, form_field: P.blanc, form_field_label: P.charbon, product_price_sale: P.terre, progress_bar_color: P.foret, ...o } });
const ivoire = scheme({});
const lin = scheme({ background: P.lin, secondary_background: P.linDeep, secondary_button: P.lin, border: '#d8ccbd' });
const sable = scheme({ background: P.sable, secondary_background: P.lin, secondary_button: P.sable, border: '#d3c6b5', subtext: '#5c5449' });
const foret = scheme({ primary_accent: P.bronzeLight, border: P.traitDark, text: '#f3eee4', subtext: '#c4c9b8', background: P.foret, secondary_background: P.foretSoft, button: '#f3eee4', button_label: P.foret, secondary_button: P.foret, secondary_button_border: '#c4c9b8', secondary_button_label: '#f3eee4', form_field: P.foretSoft, form_field_label: '#f3eee4', product_price_sale: '#e6a58c', progress_bar_color: P.bronzeLight });
const charbon = scheme({ primary_accent: P.bronzeLight, border: '#3a3c35', text: '#efeae1', subtext: '#b9b4aa', background: P.charbon, secondary_background: '#2a2c26', button: '#efeae1', button_label: P.charbon, secondary_button: P.charbon, secondary_button_border: '#b9b4aa', secondary_button_label: '#efeae1', form_field: '#2a2c26', form_field_label: '#efeae1', product_price_sale: '#e6a58c' });
// Keep Hyper's scheme ids (other templates reference them) but give every one a brand value.
const color_schemes = { 'scheme-1': ivoire, 'scheme-2': lin, 'scheme-3': sable, 'scheme-4': foret, 'scheme-inverse': foret, 'scheme-info': charbon,
  'scheme-6': ivoire, 'scheme-7': lin, 'scheme-8': sable, 'scheme-9': foret, 'scheme-10': charbon, 'scheme-11': ivoire, 'scheme-12': lin, 'scheme-13': foret, 'scheme-14': ivoire };

const current = {
  ...base, color_schemes,
  logo_width: 210, logo_width_mobile: 150, favicon: '',
  color_badge_sale: P.terre, color_badge_sale_text: '#ffffff', color_badge_hot: P.charbon, color_badge_hot_text: '#ffffff', color_badge_new: P.foret, color_badge_new_text: '#ffffff',
  color_badge_soldout: '#8c857b', color_badge_soldout_text: '#ffffff', color_badge_coming_soon: P.bronze, color_badge_coming_soon_text: '#ffffff', color_cart_bubble: P.foret, color_key_board_focus: P.bronze, overlay_color_scheme: 'scheme-1',
  type_header_font: 'jost_n3', type_body_font: 'dm_sans_n4', body_font_weight_bolder: '500', body_font_size: 15,
  heading_scale: 100, heading_mobile_scale: 76, heading_letter_spacing: -1, heading_uppercase: false, display_heading_size: 50, display_heading_uppercase: false,
  subheading_scale: 80, subheading_font: 'body', subheading_font_weight: '500', subheading_letter_spacing: 10, subheading_transform: 'uppercase',
  pcard_title_scale: 106, pcard_title_font: 'heading', pcard_title_font_weight: '400', pcard_title_uppercase: true,
  pcard_price_font: 'body', pcard_price_font_weight: '500', pcard_badge_font: 'body', pcard_badge_font_weight: '500',
  navigation_font: 'body', navigation_font_weight: '500', navigation_uppercase: false,
  buttons_font: 'body', buttons_font_weight: '500', buttons_letter_spacing: 8, buttons_transform: 'uppercase', buttons_height: 50,
  page_width: 1440, buttons_corner_radius: 'square', inputs_corner_radius: 'square', blocks_corner_radius: 'square', pcard_corner_radius: 'square', badges_corner_radius: 'square',
  enable_page_transition: false, enable_back_to_top: false,
  pcard_style: 'standard', pcard_content_alignment: 'left', pcard_title_line_limit: '1-line', pcard_color_scheme: 'scheme-2', pcard_image_ratio: '1/1', pcard_show_second_img: true,
  pcard_show_vendor: false, pcard_show_type: true, pcard_show_price: true, pcard_show_badge_soldout: true, pcard_show_cart_button: false, pcard_choose_options_actions: 'product_page',
  pcard_show_quickview_button: false, pcard_show_flash_sale: false, pcard_show_sale_badge: true, pcard_sale_badge_type: 'show_percentage', pcard_enable_color_swatches: false, pcard_mobile_hide_quick_add: true,
  product_new_tags: 'Nouveau', product_hot_tags: '', product_coming_tags: 'Bientôt disponible',
  enable_product_compare: false, quick_view_type: 'drawer',
  cart_type: 'drawer', cart_icon: 'shopping-bag', cart_style: 'solid', free_shipping_minimum_amount: '',
  cart_empty_message: '<p>Votre panier est vide. Découvrez nos collections :</p>', collection_list: ['salons-d-angle-en-l', 'salons-en-u', 'lits-adultes', 'tables-a-manger'], collection_card_color_scheme: 'scheme-2', collection_image_ratio: '1/1',
  share_facebook: true, share_x: false, share_pinterest: true,
  social_facebook_link: '', social_instagram_link: '', social_youtube_link: '', social_tiktok_link: '', social_twitter_link: '', social_snapchat_link: '', social_pinterest_link: '', social_tumblr_link: '', social_vimeo_link: '',
  predictive_search_enabled: true, predictive_search_type_enabled: false, number_results_to_show: 4, predictive_search_show_vendor: false, predictive_search_show_type: true, predictive_search_show_price: true,
  most_searched_keyworkds: 'Salon en L, Salon en U, Lit 160 x 200, Table à manger, Chaise', products_recommendations: [],
  currency_code_enabled: false, blog_cards_image_ratio: '4/3',
  // Signature Meubles settings (see settings_schema « Signature Meubles »)
  sm_whatsapp_number: '', sm_whatsapp_message: 'Bonjour Signature Meubles, je souhaite un conseil sur : {produit} — {lien}', sm_card_studio_first: true, sm_show_dimensions_on_cards: true,
};
delete current.content_for_index;
data.current = current;
fs.writeFileSync(F, JSON.stringify(data, null, 2));
console.log('settings_data.json current → Signature Meubles (' + Object.keys(color_schemes).length + ' schemes)');
