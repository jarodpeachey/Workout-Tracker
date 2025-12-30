// Polyfill for window.storage to use localStorage
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key);
      // Your code expects an object with a 'value' property if found
      return value ? { value } : null;
    },
    set: async (key, value) => {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
  };
}
