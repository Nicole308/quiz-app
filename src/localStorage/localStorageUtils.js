// Get data from local storage
export const getDataFromLocalStorage = (key) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return undefined;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      return undefined;
    }
  };
  
  // Store data in local storage
  export const setDataInLocalStorage = (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error storing data in local storage:', error);
    }
  };
  
  // Remove data from local storage
  export const removeDataFromLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from local storage:', error);
    }
  };
  