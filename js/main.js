const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', ouvert);
  });

  nav.querySelectorAll('a').forEach((lien) => {
    lien.addEventListener('click', () => {
      nav.classList.remove('ouvert');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------------- Formulaire de réservation ----------------
const form = document.getElementById('form-reservation');

if (form) {
  const statut = document.getElementById('form-statut');
  const bouton = form.querySelector('button[type="submit"]');
  const texteBoutonDepart = bouton.textContent;

  const telephoneValide = (valeur) => {
    const nettoye = valeur.trim().replace(/[\s.-]/g, '');
    return /^(?:\+33[1-9]\d{8}|0[1-9]\d{8})$/.test(nettoye);
  };
  const emailValide = (valeur) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim());

  const definirErreur = (cle, message) => {
    const zone = form.querySelector(`[data-err-for="${cle}"]`);
    const champ = form.elements[cle === 'tel' ? 'telephone' : cle];
    if (zone) zone.textContent = message || '';
    if (champ) champ.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const valider = () => {
    let ok = true;

    if (!form.nom.value.trim()) {
      definirErreur('nom', 'Merci d’indiquer votre nom et prénom.');
      ok = false;
    } else {
      definirErreur('nom', '');
    }

    if (!telephoneValide(form.telephone.value)) {
      definirErreur('tel', 'Numéro de téléphone invalide.');
      ok = false;
    } else {
      definirErreur('tel', '');
    }

    if (form.email.value.trim() && !emailValide(form.email.value)) {
      definirErreur('email', 'Adresse e-mail invalide.');
      ok = false;
    } else {
      definirErreur('email', '');
    }

    if (!form.cours.value) {
      definirErreur('cours', 'Merci de préciser ce qui vous intéresse.');
      ok = false;
    } else {
      definirErreur('cours', '');
    }

    if (!form.consentement.checked) {
      definirErreur('consentement', 'Merci d’accepter d’être recontacté.');
      ok = false;
    } else {
      definirErreur('consentement', '');
    }

    return ok;
  };

  form.querySelectorAll('input, select, textarea').forEach((champ) => {
    champ.addEventListener('input', () => {
      const cle = champ.name === 'telephone' ? 'tel' : champ.name;
      definirErreur(cle, '');
    });
  });

  form.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();

    if (!valider()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';
    statut.textContent = '';
    statut.classList.remove('ok', 'erreur');

    try {
      const donnees = new FormData(form);
      const reponse = await fetch('https://formsubmit.co/ajax/contact@z-contact-boxe.fr', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: donnees
      });

      const resultat = await reponse.json().catch(() => null);

      if (!reponse.ok || !resultat || resultat.success !== 'true') {
        throw new Error(resultat?.message || 'Réponse invalide du serveur');
      }

      form.reset();
      statut.textContent = 'Merci, votre demande a bien été envoyée. Nous vous recontactons rapidement.';
      statut.classList.add('ok');
    } catch (erreur) {
      statut.textContent = 'L’envoi a échoué. Appelez-nous directement au 07 81 68 52 76.';
      statut.classList.add('erreur');
    } finally {
      bouton.disabled = false;
      bouton.textContent = texteBoutonDepart;
    }
  });
}
