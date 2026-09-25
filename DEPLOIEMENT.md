# Déploiement — actions manuelles restantes

Ce fichier liste ce qu'il reste à faire **en dehors du code** pour que le site soit pleinement
opérationnel. Le code lui-même est prêt (voir `README.md` pour le détail des corrections).

## 1. Déployer sur Vercel

Le code n'a pas encore été déployé sur `https://z-contact-boxe-site.vercel.app/` (c'est l'URL de
production visée, à laquelle tout le SEO du site fait déjà référence). Actions :

1. Connecter le dépôt GitHub du projet à un projet Vercel (ou déployer via `vercel deploy` en CLI).
2. Vérifier dans les réglages du projet Vercel que le **Framework Preset** est bien "Other" — le
   fichier `vercel.json` force déjà `framework: null` et `outputDirectory: "."`, mais un site
   statique sans ces réglages peut, dans certains cas documentés par Vercel, ne pas être servi
   correctement (recherche d'un dossier `public/`/`dist/` inexistant → 404 sur tout le site).
3. Vérifier que le nom du projet Vercel produit bien l'URL `z-contact-boxe-site.vercel.app` — si
   Vercel attribue un nom différent (ex. suffixe aléatoire), il faudra soit renommer le projet dans
   les réglages Vercel, soit me redonner l'URL exacte pour que je resynchronise `canonical`,
   `og:url`, `sitemap.xml`, `robots.txt` et le JSON-LD.

## 2. Activer le formulaire de réservation

Le formulaire pointe maintenant vers `z.contact.boxing@gmail.com` via FormSubmit. **Cette adresse
n'a jamais été activée** (l'activation est liée à l'adresse e-mail précise, pas au site) :

1. Une fois le site en ligne, envoyer une demande de test depuis le formulaire.
2. FormSubmit envoie un e-mail à `z.contact.boxing@gmail.com` avec un lien "Activate Form".
3. Cliquer ce lien. Sans ça, **aucune demande n'arrivera jamais**, même si le site affichera un
   message d'erreur correct au visiteur (pas un faux "envoyé").

## 3. Vérifier le comportement une fois en ligne

Choses à tester concrètement après le premier déploiement (je peux le faire si tu me donnes accès
ou si tu me confirmes l'URL en ligne) :

- Charger une URL inexistante (ex. `/xyz`) → la page `404.html` personnalisée doit s'afficher.
- Ouvrir la console du navigateur sur le site en ligne → vérifier qu'aucune ressource n'est
  bloquée par la CSP (Google Fonts, l'iframe Google Maps, l'envoi du formulaire).
- Vérifier les en-têtes de sécurité réellement envoyés, par exemple avec
  [securityheaders.com](https://securityheaders.com) ou l'onglet Réseau des outils de
  développement du navigateur.
- Soumettre le formulaire pour de vrai et confirmer la réception de l'e-mail.

## 4. Référencement

- Créer un compte [Google Search Console](https://search.google.com/search-console), valider la
  propriété de `z-contact-boxe-site.vercel.app`, puis soumettre `sitemap.xml`.
- Décider si un nom de domaine personnalisé (ex. `z-contact-boxe.fr`) sera acheté et connecté à ce
  projet Vercel plus tard. Si oui, me le signaler : il faudra resynchroniser toutes les URLs de
  production (`canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt`, JSON-LD) vers ce
  nouveau domaine, comme fait cette fois pour le passage à Vercel.

## 5. En attente de ta décision (pas bloquant)

- **Mesure d'audience** : Google Analytics (gratuit, nécessite une bannière de consentement + mise
  à jour de la CSP) ou Plausible/Fathom (payant, sans cookie, pas de bannière). Détails dans
  `README.md`, section "Suivi du trafic".
- **Galerie photo** : une seule photo de la salle actuellement. Si tu as 2-3 photos
  supplémentaires (sacs de frappe, ring, séance en cours), je peux les intégrer à côté des avis.

## Ce qui a déjà été vérifié (pas à refaire)

- Adresse légale de Vercel Inc. dans les mentions légales : vérifiée sur leur politique de
  confidentialité avant d'être écrite.
- Aucun secret, aucune clé, aucun fichier admin/test/backup dans le dépôt (historique git compris).
- Formulaire testé en conditions simulées (réseau simulé) avec la nouvelle adresse : fonctionne.
- Accessibilité : 0 violation WCAG2A/AA détectée par un scan automatisé réel (axe-core) sur les
  3 pages du site, après correction des 5 problèmes de contraste initialement trouvés.
