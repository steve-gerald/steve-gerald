'use strict';

const STORAGE_KEY = 'mziba_annonces';

// Demo data
const demoAnnonces = [
  {
    id: '1',
    depart: 'Douala-CM',
    arrivee: 'Lyon-FR',
    date: '2026-06-14T00:00',
    duree: '16h 0min',
    compagnie: '',
    escales: 'Vol direct',
    prix: 11,
    poids: 25,
    message: 'Départ imminent, faites vos réservations dès maintenant !',
    nom: '~ mziba',
    contact: '+237 6 00 00 00 00',
    createdAt: Date.now() - 4 * 3600000,
  },
  {
    id: '2',
    depart: 'Paris-FR',
    arrivee: 'Yaoundé-CM',
    date: '2026-06-20T08:30',
    duree: '7h 30min',
    compagnie: 'Air France',
    escales: 'Vol direct',
    prix: 9.5,
    poids: 15,
    message: 'Places limitées, contactez-moi rapidement.',
    nom: 'Carole M.',
    contact: '+33 7 12 34 56 78',
    createdAt: Date.now() - 2 * 3600000,
  },
  {
    id: '3',
    depart: 'Bruxelles-BE',
    arrivee: 'Abidjan-CI',
    date: '2026-06-25T14:00',
    duree: '8h 15min',
    compagnie: 'Brussels Airlines',
    escales: '1 escale',
    prix: 10,
    poids: 30,
    message: 'Je peux prendre des affaires fragiles avec précaution.',
    nom: 'Jean-Paul K.',
    contact: '+32 470 00 00 00',
    createdAt: Date.now() - 1 * 3600000,
  },
];

function loadAnnonces() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoAnnonces));
  return demoAnnonces;
}

function saveAnnonces(annonces) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(annonces));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} - ${time}`;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h >= 24) return `il y a ${Math.floor(h / 24)}j`;
  if (h >= 1) return `il y a ${h}h`;
  if (m >= 1) return `il y a ${m}min`;
  return 'à l\'instant';
}

function showPage(name, id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');

  if (name === 'list') renderList();
  if (name === 'detail' && id) renderDetail(id);
}

function renderList() {
  const annonces = loadAnnonces();
  const fDepart = document.getElementById('filter-depart').value.toLowerCase();
  const fArrivee = document.getElementById('filter-arrivee').value.toLowerCase();
  const fDate = document.getElementById('filter-date').value;

  let filtered = annonces.filter(a => {
    const matchD = !fDepart || a.depart.toLowerCase().includes(fDepart);
    const matchA = !fArrivee || a.arrivee.toLowerCase().includes(fArrivee);
    const matchDate = !fDate || a.date.startsWith(fDate);
    return matchD && matchA && matchDate;
  });

  // Sort newest first
  filtered.sort((a, b) => b.createdAt - a.createdAt);

  const list = document.getElementById('annonces-list');
  const empty = document.getElementById('empty-state');

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = filtered.map(a => cardHTML(a)).join('');
}

function cardHTML(a) {
  const isDirectVol = a.escales === 'Vol direct';
  return `
  <div class="annonce-card" onclick="showPage('detail', '${a.id}')">
    <div class="card-header">
      <span class="card-date">${timeAgo(a.createdAt)} • par ${a.nom}</span>
      <span class="badge ${isDirectVol ? '' : 'red'}">${a.escales}</span>
    </div>

    <div class="card-route">
      <div class="route-city">
        <div class="route-label">✈️ Départ</div>
        <div class="route-name">${a.depart}</div>
      </div>
      <div class="route-arrow">
        <div class="route-line"></div>
        <span style="font-size:0.7rem;color:#9ca3af">${a.duree}</span>
      </div>
      <div class="route-city" style="text-align:right">
        <div class="route-label" style="justify-content:flex-end">🛬 Arrivée</div>
        <div class="route-name">${a.arrivee}</div>
      </div>
    </div>

    <div class="card-info">
      <div class="info-box">
        <span class="info-icon">📅</span>
        <div>
          <div class="info-label">Date de départ</div>
          <div class="info-value">${formatDateTime(a.date)}</div>
        </div>
      </div>
      <div class="info-box">
        <span class="info-icon">⚖️</span>
        <div>
          <div class="info-label">Poids disponible</div>
          <div class="info-value">${a.poids} kg</div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="price-tag">
        <span class="price-icon">🏷️</span>
        <span class="price-value">${a.prix}€</span>
        <span class="price-unit">/kg</span>
      </div>
      ${a.compagnie ? `<span style="font-size:0.8rem;color:#6b7280">✈️ ${a.compagnie}</span>` : ''}
    </div>
  </div>`;
}

function renderDetail(id) {
  const annonces = loadAnnonces();
  const a = annonces.find(x => x.id === id);
  if (!a) return;

  const html = `
  <div class="detail-card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
      <p style="font-size:0.85rem;color:#9ca3af">Publiée ${timeAgo(a.createdAt)}</p>
      <span class="badge">${a.escales}</span>
    </div>

    <div class="detail-date">${formatDate(a.date)}</div>

    <div class="detail-route">
      <div class="detail-route-city">
        <div class="detail-route-label">✈️ Départ</div>
        <div class="detail-route-name">${a.depart}</div>
      </div>
      <div class="detail-route-center">
        <div class="detail-route-line"></div>
        <span style="font-size:0.72rem;color:#9ca3af;font-weight:600">${a.escales}</span>
      </div>
      <div class="detail-route-city" style="text-align:right">
        <div class="detail-route-label" style="justify-content:flex-end">🛬 Arrivée</div>
        <div class="detail-route-name">${a.arrivee}</div>
      </div>
    </div>

    <div class="detail-info-grid">
      <div class="detail-info-box">
        <span class="info-icon">🕐</span>
        <div>
          <div class="info-label">Durée du vol</div>
          <div class="info-value">${a.duree}</div>
        </div>
      </div>
      <div class="detail-info-box">
        <span class="info-icon">🛫</span>
        <div>
          <div class="info-label">Escales</div>
          <div class="info-value">${a.escales}</div>
        </div>
      </div>
      <div class="detail-info-box">
        <span class="info-icon">📅</span>
        <div>
          <div class="info-label">Date de départ</div>
          <div class="info-value">${formatDateTime(a.date)}</div>
        </div>
      </div>
      <div class="detail-info-box">
        <span class="info-icon">🏢</span>
        <div>
          <div class="info-label">Compagnie</div>
          <div class="info-value">${a.compagnie || 'Non précisée'}</div>
        </div>
      </div>
    </div>

    <div class="offer-section">
      <div class="offer-title">🏷️ Offre de transport</div>
      <div class="offer-grid">
        <div class="offer-item">
          <span class="offer-item-label">Poids disponible</span>
          <span class="offer-item-value">${a.poids} kg</span>
        </div>
        <div class="offer-item">
          <span class="offer-item-label">Prix par kg</span>
          <span class="offer-item-value">${a.prix} €/kg</span>
        </div>
      </div>
    </div>

    ${a.message ? `<div class="message-box">💬 "${a.message}"</div>` : ''}

    <div class="contact-section">
      <div class="contact-info">
        <span class="contact-name">👤 ${a.nom}</span>
        <span class="contact-phone">📱 ${a.contact}</span>
      </div>
      <div class="contact-btns">
        <button class="btn-whatsapp" onclick="openWhatsApp('${a.contact}', '${a.depart}', '${a.arrivee}')">
          💬 WhatsApp
        </button>
        <button class="btn-delete" onclick="deleteAnnonce('${a.id}')">🗑️ Supprimer</button>
      </div>
    </div>
  </div>`;

  document.getElementById('detail-content').innerHTML = html;
}

function createAnnonce(e) {
  e.preventDefault();
  const annonces = loadAnnonces();

  const newAnnonce = {
    id: Date.now().toString(),
    depart: document.getElementById('f-depart').value.trim(),
    arrivee: document.getElementById('f-arrivee').value.trim(),
    date: document.getElementById('f-date').value,
    duree: document.getElementById('f-duree').value.trim(),
    compagnie: document.getElementById('f-compagnie').value.trim(),
    escales: document.getElementById('f-escales').value,
    prix: parseFloat(document.getElementById('f-prix').value),
    poids: parseFloat(document.getElementById('f-poids').value),
    message: document.getElementById('f-message').value.trim(),
    nom: document.getElementById('f-nom').value.trim(),
    contact: document.getElementById('f-contact').value.trim(),
    createdAt: Date.now(),
  };

  annonces.unshift(newAnnonce);
  saveAnnonces(annonces);
  document.getElementById('form-create').reset();
  showToast('Annonce publiée avec succès !');
  showPage('list');
}

function deleteAnnonce(id) {
  if (!confirm('Supprimer cette annonce ?')) return;
  const annonces = loadAnnonces().filter(a => a.id !== id);
  saveAnnonces(annonces);
  showToast('Annonce supprimée');
  showPage('list');
}

function filterAnnonces() {
  renderList();
}

function clearFilters() {
  document.getElementById('filter-depart').value = '';
  document.getElementById('filter-arrivee').value = '';
  document.getElementById('filter-date').value = '';
  renderList();
}

function openWhatsApp(phone, depart, arrivee) {
  const clean = phone.replace(/\s+/g, '').replace(/^\+/, '');
  const msg = encodeURIComponent(`Bonjour, je suis intéressé(e) par votre annonce de transport ${depart} → ${arrivee}.`);
  window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// Init
renderList();
