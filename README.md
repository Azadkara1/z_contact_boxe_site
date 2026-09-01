# Z-Contact Boxe — site web

Site vitrine one-page pour le club Z-Contact Boxe (kickboxing, K1, préparation physique) à Vénissieux.
HTML/CSS/JS statiques, sans framework ni build — aucune installation nécessaire.

## Structure du projet

```
z-contact-boxe/
├── index.html              page unique : toutes les sections du site
├── mentions-legales.html   page légale séparée
├── 404.html                page d'erreur personnalisée
├── robots.txt              autorise l'indexation, pointe vers le sitemap
├── sitemap.xml             liste des pages à indexer (accueil uniquement)
├── site.webmanifest        métadonnées "Ajouter à l'écran d'accueil" (mobile)
├── .htaccess               redirige les 404 vers 404.html (hébergeurs Apache, ex. OVH)
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
└── README.md
```

## Sections de la page (ancres du menu)

| Ancre         | Contenu                                                |
|---------------|---------------------------------------------------------|
| `#haut`       | En-tête / logo                                          |
| *(hero)*      | Accroche, CTA téléphone/réservation, badge avis Google   |
| `#club`       | Présentation du club et de l'entraîneur                 |
| `#cours`      | Les 3 formats de cours (collectif, individuel, prépa)    |
| `#tarifs`     | Grille tarifaire                                         |
| `#avis`       | Note Google (5,0/5) + 3 témoignages                      |
| `#reserver`   | Contacts directs (tél / WhatsApp / adresse) + formulaire |
| `#infos`      | Adresse, horaires, carte Google Maps                     |
| `#faq`        | Questions fréquentes                                     |

`mentions-legales.html` est une page séparée, liée depuis le pied de page.

## Prévisualiser en local

Les chemins sont relatifs (`css/`, `images/`, `js/`) : ouvrir `index.html` directement dans un
navigateur fonctionne. Pour un rendu identique à la mise en ligne (utile si un jour des appels
réseau ou du routing sont ajoutés), lancer un serveur local :

```bash
python -m http.server 8000
# puis ouvrir http://localhost:8000/
```

## Formulaire de réservation

Le formulaire est validé et envoyé en JavaScript (`js/main.js`) :

- validation en direct (nom, format de téléphone français, e-mail si renseigné, choix du cours,
  case RGPD) avec message d'erreur sous chaque champ, sans rechargement de page ;
- envoi en AJAX vers **FormSubmit** (`https://formsubmit.co/ajax/contact@z-contact-boxe.fr`), un
  service tiers gratuit qui relaie les soumissions par e-mail sans backend ;
- message "Merci, votre demande a bien été envoyée" affiché sur place en cas de succès, message
  d'erreur avec le numéro de téléphone en cas d'échec réseau — le tout sans quitter la page.

Un champ honeypot (`_honey`) filtre une partie du spam automatisé.

⚠️ **FormSubmit n'est pas encore activé.** Testé le 2026-09-01 : `contact@z-contact-boxe.fr`
reçoit une réponse `success:false` avec le message *"This form needs Activation"* — un e-mail
d'activation a dû être envoyé à cette adresse lors du premier test. Il faut cliquer sur le lien
"Activate Form" qu'il contient, sinon **aucune demande de réservation n'arrive jamais**, même si
le site affichera un message d'erreur clair au visiteur (pas un faux succès).

## SEO / données structurées

- `SportsActivityLocation` (adresse, horaires, tarifs, **note moyenne et avis**)
- `FAQPage` (reprend les questions de la section FAQ)

Les deux blocs sont dans le `<head>` d'`index.html`, format JSON-LD.

`robots.txt` autorise l'indexation complète et pointe vers `sitemap.xml`, qui ne référence que la
page d'accueil (`mentions-legales.html` porte `noindex` dans sa balise `<meta name="robots">` —
volontairement absente du sitemap, une page en `noindex` ne doit pas y figurer).

## Page 404 et PWA

- **`404.html`** : page d'erreur au design du site, avec retour à l'accueil et numéro de téléphone.
  Son déclenchement automatique dépend de l'hébergeur : `.htaccess` le fait fonctionner sur un
  serveur Apache (OVH et la plupart des hébergeurs mutualisés français) ; sur Netlify ou GitHub
  Pages, un fichier nommé `404.html` à la racine est détecté automatiquement, `.htaccess` est alors
  simplement ignoré sans effet secondaire. **À vérifier une fois le nom de l'hébergeur connu.**
- **`site.webmanifest`** : permet "Ajouter à l'écran d'accueil" sur mobile avec le bon nom et la
  bonne icône (180×180, réutilise `apple-touch-icon.png`). Lié depuis `index.html` uniquement —
  suffisant puisque c'est la seule page que quelqu'un installerait.

## À compléter avant mise en ligne

Ces éléments contiennent encore des valeurs provisoires :

- **`mentions-legales.html`** : statut juridique, SIRET, nom du directeur de publication et
  hébergeur sont entre crochets `[...]` — à remplir, c'est une obligation légale en France.
- **Lien Facebook** (`index.html`, pied de page) : pointe vers `facebook.com/[page-du-club]`,
  un lien factice.

## Ce qui manque au site (avis du 2026-09-01)

Constats classés par impact, pas des demandes — à discuter avant implémentation.

**Bloquant avant mise en ligne — en attente d'infos du propriétaire**
1. Mentions légales incomplètes (voir ci-dessus) — obligation légale, pas juste un détail.
2. Lien Facebook factice — à remplacer ou retirer (aussi présent dans le `sameAs` du JSON-LD).
3. **FormSubmit non activé (confirmé)** — le formulaire fonctionne (validation + AJAX corrigés
   le 2026-09-01), mais tant que le lien "Activate Form" reçu par e-mail n'est pas cliqué, aucune
   demande de réservation n'arrive réellement. Voir la section Formulaire ci-dessus.

**Confiance / conversion**
4. Une seule photo de la salle — une petite galerie (2-3 photos supplémentaires : sacs de frappe,
   ring, séance en cours) renforcerait la crédibilité, surtout juste à côté de la nouvelle section
   avis. Nécessite des photos supplémentaires du propriétaire.

**RGPD / cookies**
5. La carte Google Maps intégrée (`#infos`) charge des ressources Google au chargement de la page,
   avant tout consentement — les mentions légales le mentionnent mais, à la lettre de la
   recommandation CNIL, un embed qui dépose des cookies tiers devrait être chargé après clic ou
   consentement plutôt qu'automatiquement. Faible enjeu pour un site vitrine local, mais à noter.

**Pas urgent**
6. Pas d'outil de mesure d'audience — en cours de décision, voir section Suivi du trafic ci-dessous.
7. Les horaires structurés (JSON-LD) ne couvrent que le collectif lundi/jeudi ; les cours
   individuels "sur rendez-vous" n'ont pas d'équivalent schema.org (normal, pas d'horaire fixe).

Résolu le 2026-09-01 : `robots.txt`, `sitemap.xml`, page 404 personnalisée, `site.webmanifest`.

## Suivi du trafic (à décider)

Deux familles d'outils, avec un impact différent sur le site :

1. **Google Search Console** — gratuit, pas un outil de "trafic" à proprement parler mais montre
   les recherches Google qui amènent des visiteurs. Aucun cookie, aucun impact RGPD. À faire dans
   tous les cas, indépendamment du choix ci-dessous : créer un compte sur
   search.google.com/search-console, valider la propriété du domaine (via une balise HTML ou le
   DNS), puis soumettre `sitemap.xml`.
2. **Un outil de mesure d'audience**, deux options :
   - **Google Analytics (GA4)** — gratuit, complet, standard du marché. Pose des cookies de suivi
     → nécessite légalement une bannière de consentement avant chargement (à développer : le
     script ne doit se charger qu'après un clic "Accepter"). Étapes : créer une propriété GA4 sur
     analytics.google.com, récupérer l'ID de mesure (`G-XXXXXXX`), ajouter le script `gtag.js`
     dans `index.html`, puis construire la bannière de consentement.
   - **Plausible / Fathom** (ou équivalent) — sans cookies, conforme RGPD par nature, aucune
     bannière requise. Payant (~9 €/mois pour un petit site) sauf version auto-hébergée. Étapes :
     créer un compte, ajouter le site, coller une seule balise `<script>` dans `index.html` — rien
     d'autre à construire.

Je peux implémenter l'un ou l'autre dès que le choix est fait.

## Corrections apportées (2026-09-01)

- **Formulaire** : validation JS en direct + envoi AJAX au lieu d'un POST classique (voir section
  Formulaire ci-dessus).
- **Bug trouvé en testant** : `id="cours"` était dupliqué entre la section "Les cours" (ancre de
  menu) et le `<select>` du formulaire — HTML invalide qui cassait l'association du `<label>`
  avec son champ. Renommé en `id="champ-cours"` sur le select.
- **SEO/technique** : `robots.txt`, `sitemap.xml`, page `404.html`, `site.webmanifest` +
  `.htaccess` ajoutés.
