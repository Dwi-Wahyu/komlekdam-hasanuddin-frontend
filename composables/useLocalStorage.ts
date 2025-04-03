export const useLocalStorage = () => {
  const setItem = (key: string, value: any) => {
    if (process.client) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const getItem = (key: string) => {
    if (process.client) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  };

  const removeItem = (key: string) => {
    if (process.client) {
      localStorage.removeItem(key);
    }
  };

  return { setItem, getItem, removeItem };
};
