# 🗂️ CRM API Simulator

API REST simulée pour vérifier l'existence de clients, à tester avec **Postman**. Les données clients sont stockées dans un fichier `clients.json`.

---

## 🚀 Installation & démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm start
# ou en mode développement (rechargement auto)
npm run dev
```

Le serveur écoute sur **http://localhost:3000**

---

## 📡 Endpoints

### `GET /api/clients`
Retourne la liste complète de tous les clients.

**Réponse 200 :**
```json
{
  "success": true,
  "total": 5,
  "clients": [ ... ]
}
```

---

### `GET /api/clients/check` — ⭐ Endpoint principal
Vérifie si un client existe. Fournir **au moins un** paramètre de recherche.

| Paramètre   | Description                            | Exemple                          |
|-------------|----------------------------------------|----------------------------------|
| `email`     | Recherche par adresse email            | `?email=jean.dupont@example.com` |
| `id`        | Recherche par identifiant unique       | `?id=C001`                       |
| `telephone` | Recherche par téléphone (espaces OK)   | `?telephone=+33612345678`        |
| `nom`       | Recherche par nom (+ `prenom` optionnel) | `?nom=Dupont&prenom=Jean`      |

**✅ Client trouvé → HTTP 200**
```json
{
  "success": true,
  "existe": true,
  "message": "Client trouvé.",
  "client": {
    "id": "C001",
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "+33 6 12 34 56 78",
    "entreprise": "Dupont & Associés",
    "statut": "actif",
    "dateCreation": "2023-01-15"
  }
}
```

**❌ Client non trouvé → HTTP 404**
```json
{
  "success": false,
  "existe": false,
  "message": "Aucun client correspondant trouvé."
}
```

**⚠️ Paramètre manquant → HTTP 400**
```json
{
  "success": false,
  "message": "Paramètre requis : fournissez au moins 'email', 'telephone', 'id', ou 'nom'."
}
```

---

### `GET /api/clients/:id`
Récupère un client directement par son ID dans l'URL.

```
GET /api/clients/C002
```

---

### `GET /api/rules`
Retourne l'ensemble des règles métier de remboursement définies dans `rules.json`.

**Réponse 200 :**
```json
{
  "success": true,
  "rules": {
    "version": "1.0",
    "domain": "crm-api-mock",
    "refundPolicy": { ... },
    "rules": [ ... ],
    "workflow": { ... },
    "statuses": { ... }
  }
}
```

---

## 📬 Import dans Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Glisser le fichier `CRM_API_Postman_Collection.json`
4. Toutes les requêtes sont prêtes à l'emploi ✅

---

## 📁 Ajouter des clients

Éditez simplement le fichier `clients.json` :

```json
{
  "clients": [
    {
      "id": "C006",
      "nom": "Nouveau",
      "prenom": "Client",
      "email": "nouveau@client.fr",
      "telephone": "+33 6 00 00 00 00",
      "entreprise": "Ma Société",
      "statut": "actif",
      "dateCreation": "2025-01-01"
    }
  ]
}
```

Le fichier est relu à chaque requête — **aucun redémarrage nécessaire**.

---

## 📁 Ajouter des commandes

Les commandes fictives sont stockées dans `commandes.json`.

Chaque commande contient au minimum :

- `id` : identifiant de la commande
- `clientId` : ID du client associé
- `dateCommande` : date de la commande
- `statut` : état de traitement
- `montantHT`, `tva`, `montantTTC` : montants
- `articles` : détail des lignes de commande

Exemple :

```json
{
  "commandes": [
    {
      "id": "CMD001",
      "clientId": "C001",
      "dateCommande": "2024-09-12",
      "statut": "livree"
    }
  ]
}
```

---

## 📁 Règles métiers

Les règles de remboursement sont stockées dans `rules.json`.

Ce fichier centralise :

- les statuts de commande et leur éligibilité au remboursement
- les règles par article
- le taux de remboursement par défaut
- les étapes de validation manuelle

Exemple :

```json
{
  "refundPolicy": {
    "defaultRefundRate": 1
  }
}
```
