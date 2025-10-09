export const saveToken = (token) => {
  localStorage.setItem("jwtToken", token);
};

export const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const removeToken = () => {
  localStorage.removeItem("jwtToken");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserFromToken = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenExpired = () => {
  const user = getUserFromToken();

  if (!user || !user.exp) return true;

  return Date.now() >= user.exp * 1000;
};
