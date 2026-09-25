# Z-Contact Boxe — site web

Site vitrine one-page pour le club Z-Contact Boxe (kickboxing, K1, préparation physique) à Vénissieux.
HTML/CSS/JS statiques, sans framework ni build — aucune installation nécessaire.

**Hébergement : Vercel.** URL de production : `https://z-contact-boxe-site.vercel.app/`.

## Structure du projet

```
z-contact-boxe/
├── index.html              page unique : toutes les sections du site
├── mentions-legales.html   page légale séparée
├── 404.html                page d'erreur personnalisée
├── robots.txt              autorise l'indexation, pointe vers le sitemap
├── sitemap.xml             liste des pages à indexer (accueil uniquement)
├── site.webmanifest        métadonnées "Ajouter à l'écran d'accueil" (mobile)
├── vercel.json             en-têtes de sécurité (CSP, HSTS, etc.) + config statique explicite
├── css/
│   └── style.css           feuille de style unique (palette, layout, responsive)
├── js/
│   └── main.js              menu burger mobile + validation et envoi AJAX du formulaire
├── images/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-zcontact.jpg      image de partage réseaux sociaux
│   ├── salle-01.jpg / .webp photo de la salle (hero)
│   └── coach.jpg / .webp    photo de l'entraîneur
├── README.md
└── DEPLOIEMENT.md          actions manuelles restantes avant mise en ligne définitive
```

## Sections de la page (ancres du menu)

| Ancre         | Contenu                                                |
|---------------|---------------------------------------------------------|
| `#haut`       | En-tête / logo                                          |
| *(hero)*      | Accroche, CTA téléphone/réservation, badge avis Google   |
| `#club`       | Présentation du club et de l'entraîneur                 |
| `#cours`      | Les 3 formats (collectif, individuel, accès libre licenciés) |
| `#tarifs`     | Grille tarifaire                                         |
| `#avis`       | Note Google (5,0/5) + 3 témoignages                      |
| `#reserver`   | Contacts directs (tél / WhatsApp / adresse) + formulaire |
| `#infos`      | Adresse, horaires, carte Google Maps                     |
| `#faq`        | Questions fréquentes                                     |

`mentions-legales.html` est une page séparée, liée depuis le pied de page.

## Prévisualiser en local

Les chemins sont relatifs (`css/`, `images/`, `js/`) : ouvrir `index.html` directement dans un
navigateur fonctionne. Pour un rendu proche de la mise en ligne, lancer un serveur local :

```bash
python -m http.server 8000
# puis ouvrir http://localhost:8000/
```

Les en-têtes de sécurité définis dans `vercel.json` ne s'appliquent qu'une fois déployé sur
Vercel — un serveur local basique ne les envoie pas.

## Formulaire de réservation

Le formulaire est validé et envoyé en JavaScript (`js/main.js`) :

- validation en direct (nom, format de téléphone français, e-mail si renseigné, choix du cours)
  avec message d'erreur sous chaque champ, sans rechargement de page ;
- envoi en AJAX vers **FormSubmit** (`https://formsubmit.co/ajax/z.contact.boxing@gmail.com`), un
  service tiers gratuit qui relaie les soumissions par e-mail sans backend ;
- message "Merci, votre demande a bien été envoyée" affiché sur place en cas de succès, message
  d'erreur avec le numéro de téléphone en cas d'échec réseau — le tout sans quitter la page.

Un champ honeypot (`_honey`) filtre une partie du spam automatisé.

Chaque soumission arrive comme un e-mail dans la boîte `z.contact.boxing@gmail.com` (aucune base
de données, aucun tableau de bord — FormSubmit ne fait que relayer). Voir la section
**Où va la demande ?** plus bas.

Pas de case RGPD/consentement dans le formulaire — décision du client (2026-09-08) : la personne
qui remplit le formulaire est réputée d'accord pour être recontactée sur sa propre demande. C'est
défendable juridiquement (base légale "mesures précontractuelles" / intérêt légitime à répondre à
une demande de contact spontanée), tant que le formulaire ne sert qu'à ça et pas à de la
prospection ultérieure — auquel cas un consentement séparé redeviendrait nécessaire.

⚠️ **L'adresse du formulaire a changé le 2026-09-25** (`contact@z-contact-boxe.fr` →
`z.contact.boxing@gmail.com`). L'activation FormSubmit est liée à l'adresse e-mail précise, pas au
site : même si l'ancienne adresse avait été activée, **il faut refaire l'activation sur la
nouvelle**. Au premier envoi réel (test ou vraie demande), FormSubmit enverra un e-mail à
`z.contact.boxing@gmail.com` avec un lien "Activate Form" à cliquer — sans ça, les demandes ne
sont jamais délivrées, silencieusement. Voir `DEPLOIEMENT.md`.

## Où va la demande ?

Le formulaire n'a ni base de données ni back-office : chaque soumission part directement comme un
**e-mail** vers l'adresse configurée dans `js/main.js` et `index.html`, actuellement
`z.contact.boxing@gmail.com`. Si cette adresse change à nouveau, il faut la mettre à jour à deux
endroits : l'attribut `action` du `<form>` dans `index.html`, et l'URL du `fetch` dans `js/main.js`
— puis refaire l'activation FormSubmit sur la nouvelle adresse.

## Sécurité (`vercel.json`)

En-têtes envoyés sur toutes les routes : `Content-Security-Policy`, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (caméra/micro/géoloc/paiement désactivés) et `Strict-Transport-Security`
(1 an, sans `preload`).

La CSP n'autorise que les domaines réellement utilisés par le code :
- `style-src`/`font-src` → Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`)
- `frame-src` → `www.google.com` (iframe Google Maps)
- `connect-src` + `form-action` → `formsubmit.co` (envoi du formulaire)
- `img-src` inclut `data:` (demandé explicitement, aucune image en `data:` utilisée aujourd'hui
  mais ça laisse de la marge sans élargir aux domaines externes)

Aucun `'unsafe-inline'` nulle part : le seul style inline du site (bordure de l'iframe Maps) a été
déplacé dans `css/style.css` pour permettre une CSP stricte. Les blocs `<script type="application/
ld+json">` (données structurées) ne sont pas concernés par `script-src` : ce ne sont pas des scripts
exécutables au sens de la CSP.

`framework: null` et `outputDirectory: "."` sont fixés explicitement dans `vercel.json` : un site
100 % statique sans ces réglages peut, dans certains cas documentés par Vercel, être mal détecté
(recherche d'un dossier `public/`/`dist/` inexistant → 404 générale sur tout le site).

**⚠️ Point à vérifier après déploiement** : les `<link rel="preconnect">` vers Google Fonts ne sont
pas couverts par `connect-src` (volontaire — ce sont de simples indices de performance, pas des
requêtes bloquées si la CSP les ignore ; au pire la connexion anticipée n'a pas lieu, sans casser
le chargement réel des polices via `style-src`/`font-src`).

## SEO / données structurées

- `SportsActivityLocation` (adresse, horaires, tarifs, note moyenne et avis) — **sans** `sameAs`
  Facebook (lien retiré à la demande du client, section supprimée plutôt que laissée vide)
- `FAQPage` (reprend les questions de la section FAQ)

Les deux blocs sont dans le `<head>` d'`index.html`, format JSON-LD.

`canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt` et les champs `@id`/`url`/`image` du
JSON-LD pointent tous, de façon cohérente, vers `https://z-contact-boxe-site.vercel.app/`.

`robots.txt` autorise l'indexation complète et pointe vers `sitemap.xml`, qui ne référence que la
page d'accueil (`mentions-legales.html` porte `noindex` dans sa balise `<meta name="robots">` —
volontairement absente du sitemap, une page en `noindex` ne doit pas y figurer).

## Page 404 et PWA

- **`404.html`** : page d'erreur au design du site, avec retour à l'accueil et numéro de téléphone.
  Vercel détecte nativement un `404.html` à la racine pour un déploiement statique — **à confirmer
  une fois en ligne** (charger une URL inexistante et vérifier que cette page s'affiche).
- **`site.webmanifest`** : permet "Ajouter à l'écran d'accueil" sur mobile avec le bon nom et la
  bonne icône (180×180, réutilise `apple-touch-icon.png`). Lié depuis `index.html` uniquement.

## Ce qui reste ouvert

**RGPD / cookies**
- La carte Google Maps intégrée (`#infos`) charge des ressources Google au chargement de la page,
  avant tout consentement — les mentions légales le mentionnent mais, à la lettre de la
  recommandation CNIL, un embed qui dépose des cookies tiers devrait être chargé après clic ou
  consentement plutôt qu'automatiquement. Faible enjeu pour un site vitrine local, mais à noter.

**Confiance / conversion**
- Une seule photo de la salle — une petite galerie (2-3 photos supplémentaires) renforcerait la
  crédibilité. Nécessite des photos supplémentaires du propriétaire.

**Pas urgent**
- Pas d'outil de mesure d'audience — en cours de décision, voir section Suivi du trafic ci-dessous.
- Numéros de téléphone avec espaces normaux plutôt qu'insécables (`&nbsp;`) — risque de retour à
  la ligne au milieu du numéro, cosmétique.
- `mentions-legales.html` et `404.html` n'ont pas les mêmes meta (`og:*`, `theme-color`,
  `manifest`) qu'`index.html` — mineur, pas d'impact fonctionnel.

Résolu le 2026-09-01 : `robots.txt`, `sitemap.xml`, page 404 personnalisée, `site.webmanifest`.
Résolu le 2026-09-08 : horaires et tarifs à jour partout (visible + JSON-LD), section "accès libre
licenciés" (mardi/mercredi) ajoutée, case de consentement retirée du formulaire.
Résolu le 2026-09-25 : mentions légales complètes, lien Facebook retiré, passage Netlify → Vercel
avec `vercel.json` (en-têtes de sécurité), domaine de production synchronisé partout, formulaire
sur la nouvelle adresse, corrections d'accessibilité (contraste, `role="img"`) et de validité HTML.

## Suivi du trafic (à décider)

Deux familles d'outils, avec un impact différent sur le site :

1. **Google Search Console** — gratuit, pas un outil de "trafic" à proprement parler mais montre
   les recherches Google qui amènent des visiteurs. Aucun cookie, aucun impact RGPD. À faire dans
   tous les cas, indépendamment du choix ci-dessous : créer un compte sur
   search.google.com/search-console, valider la propriété du domaine, puis soumettre `sitemap.xml`.
2. **Un outil de mesure d'audience**, deux options :
   - **Google Analytics (GA4)** — gratuit, complet, standard du marché. Pose des cookies de suivi
     → nécessite légalement une bannière de consentement avant chargement, **et** une mise à jour
     de la CSP (`connect-src`/`script-src` devraient inclure les domaines Google Analytics).
   - **Plausible / Fathom** (ou équivalent) — sans cookies, conforme RGPD par nature, aucune
     bannière requise. Payant (~9 €/mois) sauf version auto-hébergée. Nécessite aussi une mise à
     jour de la CSP pour le domaine choisi.

Je peux implémenter l'un ou l'autre dès que le choix est fait.

## Historique des sessions précédentes

<details>
<summary>2026-09-01 — mise en place initiale</summary>

- **Formulaire** : validation JS en direct + envoi AJAX au lieu d'un POST classique.
- **Bug trouvé en testant** : `id="cours"` était dupliqué entre la section "Les cours" (ancre de
  menu) et le `<select>` du formulaire — HTML invalide qui cassait l'association du `<label>`
  avec son champ. Renommé en `id="champ-cours"` sur le select.
- **SEO/technique** : `robots.txt`, `sitemap.xml`, page `404.html`, `site.webmanifest` ajoutés.

</details>

<details>
<summary>2026-09-08 — tarifs, horaires, accès licenciés</summary>

- **Tarifs et horaires** : mise à jour des prix (450 €/an, 40 €/séance individuelle), des horaires
  des cours collectifs (20h-22h) et ajout de l'accès libre licenciés (mardi/mercredi, 18h-21h).
  Synchronisation du JSON-LD (`openingHoursSpecification`, `hasOfferCatalog`), qui référençait
  encore les anciens prix et horaires.
- **Formulaire** : case de consentement RGPD retirée à la demande du client.

</details>

## Corrections apportées (2026-09-25) — audit sécurité/production + passage Vercel

- **`index.html`** : horaires re-vérifiés (déjà corrects) ; lien Facebook retiré (footer + `sameAs`
  JSON-LD, sans remplacement) ; e-mail du formulaire changé pour `z.contact.boxing@gmail.com` ;
  URLs de production (`canonical`, `og:url`, `og:image`, `@id`/`url`/`image` JSON-LD) basculées
  vers `https://z-contact-boxe-site.vercel.app/` ; 6 `&` échappés en `&amp;` (HTML invalide sinon) ;
  `role="img"` ajouté sur les 3 spans d'étoiles porteurs d'`aria-label` (sans ça, un lecteur
  d'écran peut ignorer le label sur un `<span>` nu) ; `type="button"` ajouté au bouton burger ;
  style inline de l'iframe Maps retiré (déplacé en CSS, prérequis pour une CSP stricte sans
  `unsafe-inline`).
- **`js/main.js`** : URL FormSubmit mise à jour vers la nouvelle adresse.
- **`css/style.css`** : `--gris` assombri (#6E7480 → #5C6270) et couleur de `.opt` éclaircie
  (#7E8794 → #A9B0BA) pour corriger 5 échecs de contraste WCAG AA détectés par un scan axe-core
  réel (pas une estimation) ; règle `border:0` ajoutée sur `.carte iframe`.
- **`mentions-legales.html`** : statut juridique, SIRET, directeur de publication, hébergeur et
  e-mail de contact renseignés avec les vraies informations fournies ; adresse Vercel vérifiée sur
  leur politique de confidentialité avant d'être écrite ; URL canonique mise à jour ; lien retour
  accueil harmonisé vers `/`.
- **`sitemap.xml`**, **`robots.txt`** : domaine de production mis à jour.
- **`.htaccess`** : supprimé (inerte sur Vercel, qui n'est pas Apache).
- **`vercel.json`** : créé — en-têtes de sécurité (CSP, HSTS, X-Frame-Options, etc.),
  `framework: null` et `outputDirectory: "."` explicites pour éviter une mauvaise détection du
  site statique par Vercel (cas réel documenté sur leur forum communautaire).
- **`DEPLOIEMENT.md`** : créé — actions manuelles restantes.

Vérifications faites avant/après (Playwright + axe-core + html-validate, pas de simple lecture de
code) : 0 violation d'accessibilité WCAG2A/AA sur les 3 pages, 0 ancre cassée, 0 requête réseau en
échec, aucune trace de Facebook restante, JSON-LD et `vercel.json` syntaxiquement valides,
formulaire testé en conditions simulées avec la nouvelle adresse.
