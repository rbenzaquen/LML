const API = {
  async fetch(path, options = {}) {
    const res = await fetch(`/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Error');
    return data;
  },

  auth: {
    register: (body) => API.fetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => API.fetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => API.fetch('/auth/logout', { method: 'POST' }),
    me: () => API.fetch('/auth/me'),
  },
  plans: () => API.fetch('/plans'),
  subscriptions: {
    create: (plan) => API.fetch('/subscriptions', { method: 'POST', body: JSON.stringify({ plan }) }),
    me: () => API.fetch('/subscriptions/me'),
  },
};
