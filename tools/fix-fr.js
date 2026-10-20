// node tools/fix-fr.js — corrects Hyper's machine-translated French storefront strings (locales/fr.json),
// strips zero-width characters, and adds the « sm » namespace (Signature Meubles strings) to fr + en.default.
// Idempotent: re-run after a Hyper update.
const fs = require('fs');
const FR = 'theme/locales/fr.json', EN = 'theme/locales/en.default.json';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const fr = read(FR), en = read(EN);
const set = (o, key, v) => { const ks = key.split('.'); let x = o; ks.slice(0, -1).forEach(k => (x = x[k] = x[k] || {})); x[ks.at(-1)] = v; };

const FIX = {
  'general.search.placeholder': 'Rechercher un salon, un lit, une table…',
  'general.password_page.login_form_heading': 'Accéder à la boutique avec le mot de passe',
  'general.password_page.login_password_button': 'Accéder avec le mot de passe',
  'general.password_page.admin_link_html': 'Vous êtes le propriétaire de la boutique ? <a href="/admin" class="btn--link">Connectez-vous ici</a>',
  'general.password_page.powered_by_shopify_html': 'Cette boutique fonctionnera avec {{ shopify }}',
  'general.social.links.vimeo': 'Vimeo', 'general.social.links.tiktok': 'TikTok',
  'general.share.title': 'Partager :', 'general.share.copy': 'Copier le lien', 'general.share.copied': 'Lien copié',
  'general.breadcrumbs.home': 'Accueil', 'general.breadcrumbs.collections': 'Collections',
  'general.cart.view_empty_cart': 'Voir le panier', 'general.cart.note.title': 'Note de commande', 'general.cart.note.caption': 'Instructions particulières pour votre commande',
  'general.cart.note.button': 'Enregistrer', 'general.cart.coupon.title': 'Code de réduction', 'general.cart.coupon.caption': 'Saisissez votre code de réduction',
  'general.cart.free_shipping.remaining_html': 'Plus que {{ remaining_amount }} pour bénéficier de la livraison offerte.', 'general.cart.free_shipping.congratulations_html': 'La livraison vous est offerte.',
  'general.cart.shipping_calculator.title': 'Estimer les frais de livraison', 'general.cart.shipping_calculator.one_result': 'Un tarif de livraison est disponible pour votre adresse :', 'general.cart.shipping_calculator.multiple_results': 'Plusieurs tarifs de livraison sont disponibles pour votre adresse :',
  'general.cart.cart_count.one': '{{ count }} article', 'general.cart.cart_count.other': '{{ count }} articles',
  'general.cart.gift_wrapping.message_html': 'Emballer cette commande en cadeau pour {{ price }}.',
  'general.slider.next_slide': 'Diapositive suivante', 'general.slider.previous_slide': 'Diapositive précédente', 'general.meta.tags': 'Étiquette « {{ tags }} »',
  'newsletter.label': 'Adresse e-mail', 'newsletter.success': 'Merci pour votre inscription.', 'newsletter.placeholder': 'Votre adresse e-mail',
  'accessibility.vendor': 'Marque :', 'accessibility.product_type': 'Type :', 'accessibility.menu_drawer': 'Ouvrir le menu',
  'accessibility.refresh_page': 'Choisir une option recharge entièrement la page.',
  'blogs.article.comments.one': '{{ count }} commentaire', 'blogs.article.comments.other': '{{ count }} commentaires', 'blogs.article.post': 'Publier', 'blogs.article.success': 'Votre commentaire a bien été publié. Merci !',
  'blogs.article.success_moderated': 'Votre commentaire a bien été envoyé. Il sera publié après modération.', 'blogs.article.tags': 'Étiquettes :',
  'onboarding.no_script_alert': 'Veuillez activer JavaScript pour utiliser cette fonctionnalité.',
  'products.compare.toggle_compare_list': 'Afficher ou masquer la comparaison',
  'products.product.buy_it_now': 'Acheter maintenant', 'products.product.choose_options': 'Choisir les options', 'products.product.quick_view_title': 'Choisissez une option',
  'products.product.inventory_in_stock': 'En stock', 'products.product.inventory_in_stock_show_count_html': 'En stock <strong>({{ quantity }})</strong>',
  'products.product.inventory_low_stock_one_item_html': 'Plus que <strong>{{ quantity }}</strong> article en stock.', 'products.product.inventory_low_stock_many_items_html': 'Plus que <strong>{{ quantity }}</strong> articles en stock.',
  'products.product.inventory_out_of_stock_continue_selling': 'Disponible sur commande', 'products.product.on_sale': 'Promotion', 'products.product.open_size_chart': 'Guide des dimensions',
  'products.product.media.play_model': 'Ouvrir la visionneuse 3D', 'products.product.media.image_available': "L'image {{ index }} est maintenant affichée dans la galerie.",
  'products.product.volume_pricing.title': 'Prix dégressifs', 'products.product.volume_pricing.note': 'Prix dégressifs disponibles', 'products.product.volume_pricing.price_at_each': 'à {{ price }} l’unité', 'products.product.volume_pricing.each': '{{ money }} l’unité',
  'products.product.pickup_availability.pick_up_available': 'Retrait disponible', 'products.product.pickup_availability.unavailable': 'Impossible de charger la disponibilité du retrait', 'products.product.pickup_availability.refresh': 'Actualiser',
  'products.product.price.regular_price': 'Prix habituel', 'products.product.price.sale_price': 'Prix promotionnel', 'products.product.price.unit_price': 'Prix unitaire',
  'products.product.question_form.field_email': 'Votre e-mail', 'products.product.question_form.submit_button': 'Envoyer ma question',
  'products.product.sku': 'Référence', 'products.product.vendor': 'Marque', 'products.product.type': 'Type', 'products.product.view_details': 'Voir le produit', 'products.product.view_full_details': 'Voir la fiche complète',
  'products.product.include_taxes': 'TTC.', 'products.product.shipping_policy_html': '<a href="{{ link }}">Frais de livraison</a> calculés à la validation de la commande.',
  'products.facets.clear': 'Effacer', 'products.facets.from': 'De', 'products.facets.filter_button': 'Filtrer', 'products.facets.filters_selected.other': '{{ count }} sélectionnés',
  'products.facets.product_count.one': '{{ product_count }} produit sur {{ count }}',
  'collections.general.empty': 'Cette collection ne contient pas encore de produits.', 'collections.general.use_fewer_filters': 'Retirez des filtres ou',
  'templates.404.title': 'Page introuvable', 'templates.search.no_results_message': 'Vérifiez l’orthographe ou essayez un autre mot.', 'templates.search.products': 'Produits',
  'templates.search.results_with_count_and_term.one': '{{ count }} résultat pour « {{ terms }} »', 'templates.search.results_with_count_and_term.other': '{{ count }} résultats pour « {{ terms }} »',
  'templates.search.clear': 'Effacer', 'templates.search.most_searched_keywords': 'Recherches fréquentes', 'templates.search.most_searched_products': 'Produits suggérés',
  'templates.contact.form.send': 'Envoyer le message', 'templates.contact.form.post_success': 'Merci pour votre message. Nous vous répondrons dans les meilleurs délais.',
  'sections.slideshow.slide': 'Diapositive', 'sections.main-blog.all_posts': 'Tous les articles', 'sections.mobile-sticky-bar.home': 'Accueil',
  'sections.cart.checkout': 'Passer la commande', 'sections.cart.update': 'Mettre à jour', 'sections.cart.estimated_total': 'Total estimé',
  'sections.cart.taxes_and_shipping_policy_at_checkout_html': 'Taxes et <a href="{{ link }}" class="btn--link text-sm-extra">frais de livraison</a> calculés à la validation de la commande',
  'sections.cart.taxes_included_but_shipping_at_checkout': 'TTC — frais de livraison calculés à la validation de la commande',
  'sections.cart.taxes_and_shipping_at_checkout': 'Taxes et frais de livraison calculés à la validation de la commande',
  'sections.quick_order_list.each': '{{ money }} l’unité', 'sections.quick_order_list.items_added.one': '{{ quantity }} article ajouté', 'sections.quick_order_list.items_added.other': '{{ quantity }} articles ajoutés',
  'sections.quick_order_list.items_removed.one': '{{ quantity }} article retiré', 'sections.quick_order_list.items_removed.other': '{{ quantity }} articles retirés', 'sections.quick_order_list.step_error': 'Cet article s’ajoute par multiples de {{ step }}.',
  'sections.products-bundle-selection.heading': 'Votre ensemble', 'sections.products-bundle-selection.help': 'Les remises sont appliquées à la validation de la commande.', 'sections.products-bundle-selection.add': "Ajouter l'ensemble au panier",
  'sections.products-bundle-selection.add_one_more': 'Ajoutez encore %% COUNT %% article', 'sections.products-bundle-selection.add_few_more': 'Ajoutez encore %% COUNT %% articles',
  'sections.products-bundle-selection.limit_message': "L'ensemble peut contenir au maximum {{ maximum }} produits.", 'sections.products-bundle-selection.duplicate_message': 'Ce produit fait déjà partie de l’ensemble.',
  'customer.addresses.default': 'Par défaut', 'customer.account_action': 'Se connecter', 'customer.login_page.submit': 'Envoyer',
  'customer.order.date_html': 'Passée le {{ date }}', 'customer.order.billing_address': 'Adresse de facturation', 'customer.order.shipping_address': 'Adresse de livraison', 'customer.order.fulfillment_status': 'Statut de traitement',
  'customer.order.discount': 'Réduction', 'customer.order.shipping': 'Livraison', 'customer.order.tax': 'Taxes', 'customer.order.sku': 'Référence', 'customer.order.fulfilled_at_html': 'Traitée le {{ date }}',
  'customer.order.track_shipment': 'Suivre la livraison', 'customer.order.subtotal': 'Sous-total', 'customer.order.total_duties': 'Droits de douane', 'customer.orders.fulfillment_status': 'Statut de traitement',
  'customer.recover_password.subtext': 'Nous vous enverrons un e-mail pour réinitialiser votre mot de passe.', 'customer.register.submit': 'Créer mon compte',
  'gift_cards.issued.title': 'Votre carte cadeau {{ shop }} de {{ value }}', 'recipient.form.checkbox': 'Je souhaite l’offrir en cadeau',
  'recipient.form.expanded': 'Formulaire du destinataire ouvert', 'recipient.form.collapsed': 'Formulaire du destinataire fermé', 'recipient.form.send_on_label': "Date d'envoi (facultatif)",
};
// Signature Meubles strings — fr / en
const SM = {
  'sm.dimensions.label': ['Dimensions', 'Dimensions'],
  'sm.dimensions.count.one': ['{{ count }} dimension', '{{ count }} size'],
  'sm.dimensions.count.other': ['{{ count }} dimensions disponibles', '{{ count }} sizes available'],
  'sm.specs.heading': ['Caractéristiques', 'Specifications'],
  'sm.specs.reference': ['Référence', 'Reference'],
  'sm.specs.category': ['Catégorie', 'Category'],
  'sm.specs.available_sizes': ['Dimensions disponibles', 'Available sizes'],
  'sm.specs.price_ttc': ['Prix affichés TTC, en dirhams.', 'Prices include tax, in dirhams.'],
  'sm.whatsapp.cta': ['Demander conseil sur WhatsApp', 'Ask for advice on WhatsApp'],
  'sm.whatsapp.opens': ['Ouvre WhatsApp dans un nouvel onglet', 'Opens WhatsApp in a new tab'],
  'sm.whatsapp.floating': ['Nous écrire sur WhatsApp', 'Message us on WhatsApp'],
  'sm.collection.count.one': ['{{ count }} modèle', '{{ count }} model'],
  'sm.collection.count.other': ['{{ count }} modèles', '{{ count }} models'],
  'sm.collection.from_html': ['à partir de {{ price }}', 'from {{ price }}'],
  'sm.collection.models': ['Modèles', 'Models'],
  'sm.collection.view_all': ['Voir tout', 'View all'],
  'sm.general.discover': ['Découvrir', 'Discover'],
  'sm.specs.material': ['Matière', 'Material'], 'sm.specs.finish': ['Finition', 'Finish'], 'sm.specs.care': ['Entretien', 'Care'], 'sm.specs.delivery': ['Livraison', 'Delivery'],
  'sm.contact.directions': ['Itinéraire', 'Directions'],
};
const strip = o => { for (const [k, v] of Object.entries(o)) { if (typeof v === 'object') strip(v); else o[k] = v.replace(/[​‌‍﻿]/g, ''); } };
strip(fr);
let n = 0; for (const [k, v] of Object.entries(FIX)) { set(fr, k, v); n++; }
for (const [k, [f, e]] of Object.entries(SM)) { set(fr, k, f); set(en, k, e); }
fs.writeFileSync(FR, JSON.stringify(fr, null, 2)); fs.writeFileSync(EN, JSON.stringify(en, null, 2));
// Other storefront locales shipped by Hyper: same keys (English text) so Theme Check MatchingTranslations passes
for (const lf of fs.readdirSync('theme/locales').filter(x => /^[a-z]{2}.json$/.test(x) && x !== 'fr.json')) { const o = read('theme/locales/' + lf); for (const [k, [, e]] of Object.entries(SM)) set(o, k, e); fs.writeFileSync('theme/locales/' + lf, JSON.stringify(o, null, 2)); }
console.log(`fr.json: ${n} corrections, ${Object.keys(SM).length} sm.* strings (fr + en)`);
