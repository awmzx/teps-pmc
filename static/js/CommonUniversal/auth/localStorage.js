export const getToken = () => localStorage.getItem("isValidate");

export const setToken = token => localStorage.setItem("isValidate", token);

export const removeToken = () => localStorage.removeItem("isValidate");
