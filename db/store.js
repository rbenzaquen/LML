const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function load() {
  if (!fs.existsSync(dbPath)) {
    return { users: [], subscriptions: [], brands: [], contacts: [] };
  }
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!data.brands) data.brands = [];
  if (!data.contacts) data.contacts = [];
  return data;
}

function save(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const db = {
  users: {
    findByEmail(email) {
      return load().users.find((u) => u.email === email) || null;
    },
    findById(id) {
      return load().users.find((u) => u.id === id) || null;
    },
    create(user) {
      const data = load();
      const id = data.users.length ? Math.max(...data.users.map((u) => u.id)) + 1 : 1;
      const newUser = { id, ...user, created_at: new Date().toISOString() };
      data.users.push(newUser);
      save(data);
      return newUser;
    },
    update(id, updates) {
      const data = load();
      const idx = data.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      data.users[idx] = { ...data.users[idx], ...updates };
      save(data);
      return data.users[idx];
    },
    findByResetToken(token) {
      const users = load().users;
      return users.find((u) => u.reset_token === token && u.reset_expires && new Date(u.reset_expires) > new Date()) || null;
    },
  },
  subscriptions: {
    findActiveByUserId(userId) {
      return load().subscriptions.find(
        (s) => s.user_id === userId && s.status === 'active'
      ) || null;
    },
    create(sub) {
      const data = load();
      const id = data.subscriptions.length
        ? Math.max(...data.subscriptions.map((s) => s.id)) + 1
        : 1;
      const newSub = {
        id,
        ...sub,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      data.subscriptions.push(newSub);
      save(data);
      return newSub;
    },
  },
  brands: {
    findByUserId(userId) {
      return load().brands.filter((b) => b.user_id === userId);
    },
    countByUserId(userId) {
      return load().brands.filter((b) => b.user_id === userId).length;
    },
    create(brand) {
      const data = load();
      const id = data.brands.length
        ? Math.max(...data.brands.map((b) => b.id)) + 1
        : 1;
      const newBrand = {
        id,
        ...brand,
        created_at: new Date().toISOString(),
      };
      data.brands.push(newBrand);
      save(data);
      return newBrand;
    },
    delete(id, userId) {
      const data = load();
      const idx = data.brands.findIndex((b) => b.id === id && b.user_id === userId);
      if (idx === -1) return false;
      data.brands.splice(idx, 1);
      save(data);
      return true;
    },
  },
  contacts: {
    create(contact) {
      const data = load();
      const id = data.contacts.length
        ? Math.max(...data.contacts.map((c) => c.id)) + 1
        : 1;
      const newContact = { id, ...contact, created_at: new Date().toISOString() };
      data.contacts.push(newContact);
      save(data);
      return newContact;
    },
  },
};

module.exports = db;
