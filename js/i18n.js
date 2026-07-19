/**
 * TZ Digital — EN/NL language toggle
 * Runs immediately (script tag placed after all content, before main.js) so the saved/default
 * language is applied before the hero headline's entrance animation plays.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tz_lang';
  var DEFAULT_LANG = 'en';

  var TRANSLATIONS = {
    'nav.work': { en: `Work`, nl: `Werk` },
    'nav.services': { en: `Services`, nl: `Diensten` },
    'nav.pricing': { en: `Pricing`, nl: `Prijzen` },
    'nav.about': { en: `About`, nl: `Over ons` },
    'nav.contact': { en: `Contact`, nl: `Contact` },

    'hero.headline': {
      en: `<span class="word">We</span>
      <span class="word">build</span>
      <span class="word">websites</span>
      <span class="word">that</span>
      <span class="word">look</span>
      <span class="word word--accent">like this</span>`,
      nl: `<span class="word">Wij</span>
      <span class="word">bouwen</span>
      <span class="word">websites</span>
      <span class="word">die</span>
      <span class="word">eruitzien</span>
      <span class="word word--accent">zoals deze.</span>`,
    },
    'hero.cta': { en: `Get in touch`, nl: `Neem contact op` },
    'hero.trust': {
      en: `Trusted by local businesses in Maastricht.`,
      nl: `Vertrouwd door lokale ondernemers in Maastricht.`,
    },

    'work.eyebrow': { en: `Our Work`, nl: `Ons Werk` },
    'work.headline': { en: `A Few Sites We've Brought to Life`, nl: `Een Aantal Sites Die We Hebben Gebouwd` },
    'work.roundabout.desc': {
      en: `Custom website for The Roundabout, Maastricht`,
      nl: `Website op maat voor The Roundabout, Maastricht`,
    },
    'work.roundabout.visit': { en: `Visit live site ↗`, nl: `Bekijk live site ↗` },
    'work.kapsalon.desc': {
      en: `Kapsalon &amp; barbershop website, Maastricht`,
      nl: `Website voor kapsalon &amp; barbershop, Maastricht`,
    },
    'work.kapsalon.visit': { en: `Visit live site ↗`, nl: `Bekijk live site ↗` },
    'work.salon.desc': {
      en: `Skin &amp; hair salon website, Maastricht`,
      nl: `Website voor huid- &amp; haarsalon, Maastricht`,
    },
    'work.salon.visit': { en: `Visit live site ↗`, nl: `Bekijk live site ↗` },

    'services.eyebrow': { en: `What We Do`, nl: `Wat We Doen` },
    'services.headline': { en: `Everything Your Business Needs Online`, nl: `Alles Wat Uw Bedrijf Online Nodig Heeft` },
    'services.support': {
      en: `From your first website to AI-powered growth, pick what fits and add more any time.`,
      nl: `Van uw eerste website tot AI-gedreven groei: kies wat past en breid later uit.`,
    },
    'services.card1.name': { en: `Website Design &amp; Development`, nl: `Websiteontwerp &amp; -ontwikkeling` },
    'services.card1.desc': {
      en: `A custom, mobile-friendly website designed and built around your business, not a template.`,
      nl: `Een op maat gemaakte, mobielvriendelijke website, speciaal ontworpen voor uw bedrijf, geen sjabloon.`,
    },
    'services.card2.name': { en: `Shopify &amp; E-Commerce Stores`, nl: `Shopify &amp; Webshops` },
    'services.card2.desc': {
      en: `A Shopify store built to actually convert visitors into paying customers.`,
      nl: `Een Shopify-winkel die bezoekers daadwerkelijk omzet in betalende klanten.`,
    },
    'services.card3.name': { en: `SEO Optimization`, nl: `SEO-optimalisatie` },
    'services.card3.desc': {
      en: `We get your business found on Google, so customers find you first.`,
      nl: `We zorgen dat uw bedrijf gevonden wordt op Google, zodat klanten u als eerste vinden.`,
    },
    'services.card4.name': { en: `NFC Tags`, nl: `NFC-tags` },
    'services.card4.desc': {
      en: `Tap-to-review tags for your counter, turning happy customers into 5-star reviews.`,
      nl: `Tap-to-review tags voor bij de kassa, die tevreden klanten omzetten in 5-sterrenreviews.`,
    },
    'services.card5.name': { en: `AI Agents`, nl: `AI-agents` },
    'services.card5.desc': {
      en: `A custom AI agent that answers questions and handles bookings for you.`,
      nl: `Een AI-agent op maat die vragen beantwoordt en boekingen voor u afhandelt.`,
    },
    'services.card6.name': { en: `Ongoing Growth &amp; Maintenance`, nl: `Doorlopende Groei &amp; Onderhoud` },
    'services.card6.desc': {
      en: `We keep improving your site and your online presence long after launch.`,
      nl: `We blijven uw site en online aanwezigheid verbeteren, ook lang na de lancering.`,
    },

    'pricing.eyebrow': { en: `Pricing`, nl: `Prijzen` },
    'pricing.headline': { en: `Simple Pricing, No Surprises`, nl: `Duidelijke Prijzen, Geen Verrassingen` },
    'pricing.support': {
      en: `Every project is scoped and quoted around what your business actually needs.`,
      nl: `Elk project wordt afgestemd en geprijsd op wat uw bedrijf daadwerkelijk nodig heeft.`,
    },
    'pricing.tier1.label': { en: `Tier 01`, nl: `Pakket 01` },
    'pricing.tier1.name': { en: `Website or Shopify Store`, nl: `Website of Shopify-winkel` },
    'pricing.tier1.price': { en: `Custom`, nl: `Op maat` },
    'pricing.tier1.note': {
      en: `Every website or Shopify store is scoped and quoted individually, so you only pay for what you need.`,
      nl: `Elke website of Shopify-winkel wordt individueel afgestemd en geprijsd, zodat u alleen betaalt voor wat u nodig heeft.`,
    },
    'pricing.tier1.cta': { en: `Get a quote`, nl: `Offerte aanvragen` },
    'pricing.tier2.label': { en: `Tier 02`, nl: `Pakket 02` },
    'pricing.tier2.name': { en: `Website + SEO`, nl: `Website + SEO` },
    'pricing.tier2.price': { en: `Custom`, nl: `Op maat` },
    'pricing.tier2.note': {
      en: `Website and SEO scoped together and quoted as one project, tailored to your goals.`,
      nl: `Website en SEO samen afgestemd en geprijsd als één project, afgestemd op uw doelen.`,
    },
    'pricing.tier2.cta': { en: `Get a quote`, nl: `Offerte aanvragen` },
    'pricing.tier3.label': { en: `Tier 03`, nl: `Pakket 03` },
    'pricing.tier3.name': { en: `NFC Tags &amp; AI Agents`, nl: `NFC-tags &amp; AI-agents` },
    'pricing.tier3.price': { en: `Custom`, nl: `Op maat` },
    'pricing.tier3.note': {
      en: `Every business is different, so you'll get a tailored quote based on what you need.`,
      nl: `Elk bedrijf is anders, dus u ontvangt een offerte op maat, gebaseerd op wat u nodig heeft.`,
    },
    'pricing.tier3.cta': { en: `Get a quote`, nl: `Offerte aanvragen` },
    'pricing.tier4.label': { en: `Tier 04`, nl: `Pakket 04` },
    'pricing.tier4.name': { en: `Ongoing Growth &amp; Maintenance`, nl: `Doorlopende Groei &amp; Onderhoud` },
    'pricing.tier4.price': { en: `Custom`, nl: `Op maat` },
    'pricing.tier4.note': {
      en: `A tailored monthly plan covering Google Business Profile, reviews, Instagram, and more`,
      nl: `Een maandelijks plan op maat voor Google Bedrijfsprofiel, reviews, Instagram en meer`,
    },
    'pricing.tier4.feature1': {
      en: `Google Business Profile management &amp; ranking support`,
      nl: `Beheer van Google Bedrijfsprofiel &amp; ondersteuning bij ranking`,
    },
    'pricing.tier4.feature2': { en: `Instagram support`, nl: `Ondersteuning voor Instagram` },
    'pricing.tier4.feature3': {
      en: `Review system setup, plus optional NFC-based review reward tags`,
      nl: `Opzetten van reviewsysteem, met optionele NFC-tags als beloning voor reviews`,
    },
    'pricing.tier4.feature4': {
      en: `Website and Instagram content sync (extra cost, requires API integration)`,
      nl: `Synchronisatie van website- en Instagram-content (meerprijs, vereist API-koppeling)`,
    },
    'pricing.tier4.feature5': {
      en: `Booking system integration, available on request`,
      nl: `Integratie van boekingssysteem, op aanvraag beschikbaar`,
    },
    'pricing.tier4.feature6': {
      en: `General ongoing updates and fixes, basically anything the site needs`,
      nl: `Algemene doorlopende updates en aanpassingen, eigenlijk alles wat de site nodig heeft`,
    },
    'pricing.tier4.cta': { en: `Get a quote`, nl: `Offerte aanvragen` },

    'about.eyebrow': { en: `About`, nl: `Over Ons` },
    'about.headline': { en: `Meet TZ Digital`, nl: `Maak Kennis met TZ Digital` },
    'about.p1': {
      en: `We're a small team based around Maastricht, building and looking after websites for local businesses. Between the three of us we cover client relationships, development, and day-to-day operations, splitting the work differently depending on what each project needs.`,
      nl: `We zijn een klein team rond Maastricht dat websites bouwt en onderhoudt voor lokale ondernemers. Met z'n drieën dekken we klantcontact, ontwikkeling en dagelijkse werkzaamheden, waarbij de verdeling per project kan verschillen.`,
    },
    'about.p2': {
      en: `That means no account managers and no outsourced developers. When you reach out to TZ Digital, you're talking directly to the people actually building and running your site.`,
      nl: `Dat betekent geen accountmanagers en geen uitbestede developers. Als u contact opneemt met TZ Digital, spreekt u rechtstreeks met de mensen die uw site daadwerkelijk bouwen en beheren.`,
    },
    'about.team1.role': { en: `Client Lead &amp; Growth`, nl: `Klantrelaties &amp; Groei` },
    'about.team2.role': { en: `Lead Developer`, nl: `Hoofdontwikkelaar` },
    'about.team3.role': { en: `Operations`, nl: `Operationeel Beheer` },

    'cta.eyebrow': { en: `Get Started`, nl: `Aan de Slag` },
    'cta.headline': { en: `Your Business Deserves a Website This Good.`, nl: `Uw Bedrijf Verdient een Website Die Net Zo Goed Is.` },
    'cta.support': {
      en: `No templates, no fluff, just a site that works as hard as you do.`,
      nl: `Geen sjablonen, geen onzin, gewoon een site die net zo hard werkt als u.`,
    },
    'cta.button': { en: `Let's talk`, nl: `Laten we praten` },

    'contact.eyebrow': { en: `Contact`, nl: `Contact` },
    'contact.headline': { en: `Let's Build Something`, nl: `Laten We Iets Bouwen` },
    'contact.support': {
      en: `Tell us about your business, and we'll get back to you within 24 hours.`,
      nl: `Vertel ons over uw bedrijf, en we nemen binnen 24 uur contact met u op.`,
    },
    'contact.info.intro': {
      en: `Ready to start your project? Reach out and we'll get back to you within 24 hours.`,
      nl: `Klaar om te starten met uw project? Neem contact op en we reageren binnen 24 uur.`,
    },
    'contact.form.labelName': { en: `Name`, nl: `Naam` },
    'contact.form.labelEmail': { en: `Email`, nl: `E-mail` },
    'contact.form.labelMessage': { en: `Message`, nl: `Bericht` },
    'contact.form.submit': { en: `Send message`, nl: `Bericht versturen` },

    'footer.copy': {
      en: `&copy; 2026 TZ Digital. All rights reserved.`,
      nl: `&copy; 2026 TZ Digital. Alle rechten voorbehouden.`,
    },

    'contact.status.success': {
      en: `Thanks — we'll get back to you within 24 hours.`,
      nl: `Bedankt — we nemen binnen 24 uur contact met u op.`,
    },
    'contact.status.error': {
      en: `Something went wrong. Please try again or email us directly.`,
      nl: `Er ging iets mis. Probeer het opnieuw of mail ons rechtstreeks.`,
    },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var entry = TRANSLATIONS[key];
      if (entry && entry[lang] != null) {
        el.innerHTML = entry[lang];
      }
    });

    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang-btn') === lang);
    });

    document.documentElement.setAttribute('lang', lang);
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
  }

  applyLanguage(getLang());

  document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang-btn'));
    });
  });

  window.TZ_I18N = {
    t: function (key) {
      var entry = TRANSLATIONS[key];
      if (!entry) return '';
      return entry[getLang()] != null ? entry[getLang()] : entry[DEFAULT_LANG];
    },
  };
})();
