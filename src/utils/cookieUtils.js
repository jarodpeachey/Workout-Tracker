// Storage utility functions (uses localStorage instead of cookies)
export const setCookie = (name, value, days = 7) => {
  try {
    localStorage.setItem(name, String(value));
  } catch (e) {
    console.error('Failed to set item in localStorage', e);
  }
};

export const getCookie = (name) => {
  try {
    const v = localStorage.getItem(name);
    return v === null ? null : v;
  } catch (e) {
    console.error('Failed to read item from localStorage', e);
    return null;
  }
};

export const deleteCookie = (name) => {
  try {
    localStorage.removeItem(name);
  } catch (e) {
    console.error('Failed to remove item from localStorage', e);
  }
};
