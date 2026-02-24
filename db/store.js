const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function load() {
  if (!fs.existsSync(dbPath)) {
    return { users: [], subscriptions: [] };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
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
};

module.exports = db;
