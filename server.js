const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const CLIENTS_FILE = path.join(__dirname, "clients.json");
const COMMANDES_FILE = path.join(__dirname, "commandes.json");
const RULES_FILE = path.join(__dirname, "rules.json");

// Lecture du fichier JSON
function loadClients() {
  const raw = fs.readFileSync(CLIENTS_FILE, "utf-8");
  return JSON.parse(raw).clients;
}

function loadCommandes() {
  const raw = fs.readFileSync(COMMANDES_FILE, "utf-8");
  return JSON.parse(raw).commandes;
}

function loadRules() {
  const raw = fs.readFileSync(RULES_FILE, "utf-8");
  return JSON.parse(raw);
}

// ──────────────────────────────────────────────
// GET /api/clients
// Liste tous les clients
// ──────────────────────────────────────────────
app.get("/api/clients", (req, res) => {
  const clients = loadClients();
  res.json({
    success: true,
    total: clients.length,
    clients,
  });
});

// ──────────────────────────────────────────────
// GET /api/clients/check?email=...
// GET /api/clients/check?telephone=...
// GET /api/clients/check?nom=...&prenom=...
// Vérifie l'existence d'un client
// ──────────────────────────────────────────────
app.get("/api/clients/check", (req, res) => {
  const { email, telephone, nom, prenom, id } = req.query;

  if (!email && !telephone && !nom && !id) {
    return res.status(400).json({
      success: false,
      message:
        "Paramètre requis : fournissez au moins 'email', 'telephone', 'id', ou 'nom'.",
    });
  }

  const clients = loadClients();
  let found = null;

  if (id) {
    found = clients.find(
      (c) => c.id.toLowerCase() === id.toLowerCase()
    );
  } else if (email) {
    found = clients.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
  } else if (telephone) {
    const normalized = telephone.replace(/\s/g, "");
    found = clients.find(
      (c) => c.telephone.replace(/\s/g, "") === normalized
    );
  } else if (nom) {
    found = clients.find(
      (c) =>
        c.nom.toLowerCase() === nom.toLowerCase() &&
        (!prenom || c.prenom.toLowerCase() === prenom.toLowerCase())
    );
  }

  if (found) {
    return res.status(200).json({
      success: true,
      existe: true,
      message: "Client trouvé.",
      client: found,
    });
  } else {
    return res.status(404).json({
      success: false,
      existe: false,
      message: "Aucun client correspondant trouvé.",
    });
  }
});

// ──────────────────────────────────────────────
// GET /api/clients/:id
// Récupère un client par son ID
// ──────────────────────────────────────────────
app.get("/api/clients/:id", (req, res) => {
  const clients = loadClients();
  const client = clients.find(
    (c) => c.id.toLowerCase() === req.params.id.toLowerCase()
  );

  if (!client) {
    return res.status(404).json({
      success: false,
      message: `Client avec l'ID '${req.params.id}' introuvable.`,
    });
  }

  res.json({ success: true, client });
});

// ──────────────────────────────────────────────
// GET /api/order/:order_id
// Récupère une commande par son ID
// ──────────────────────────────────────────────
app.get("/api/order/:order_id", (req, res) => {
  const commandes = loadCommandes();
  const order = commandes.find(
    (commande) =>
      commande.id.toLowerCase() === req.params.order_id.toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Commande avec l'ID '${req.params.order_id}' introuvable.`,
    });
  }

  res.json({ success: true, order });
});

// ──────────────────────────────────────────────
// GET /api/rules
// Récupère toutes les règles métier
// ──────────────────────────────────────────────
app.get("/api/rules", (req, res) => {
  const rules = loadRules();
  res.json({
    success: true,
    rules,
  });
});

// ──────────────────────────────────────────────
// Démarrage du serveur
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 CRM API démarrée sur http://localhost:${PORT}`);
  console.log(`\nEndpoints disponibles :`);
  console.log(`  GET  /api/clients                         → liste tous les clients`);
  console.log(`  GET  /api/clients/:id                     → client par ID`);
  console.log(`  GET  /api/clients/check?email=...         → vérification par email`);
  console.log(`  GET  /api/clients/check?telephone=...     → vérification par téléphone`);
  console.log(`  GET  /api/clients/check?id=...            → vérification par ID`);
  console.log(`  GET  /api/clients/check?nom=...&prenom=...→ vérification par nom\n`);
  console.log(`  GET  /api/clients/:id                     → client par ID`);
  console.log(`  GET  /api/order/:order_id                 → commande par ID`);
  console.log(`  GET  /api/rules                           → règles métier de remboursement`);
});
