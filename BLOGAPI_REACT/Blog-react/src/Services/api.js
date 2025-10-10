const API_BASE_URL = "http://localhost:8080/api/v1/auth";

export const loginUser = async (userName, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Login failed");
  }

  return await response.text();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: userData.userName,
      email: userData.email,
      roles: ["AUTHOR"],
      password: userData.password,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Registration failed");
  }

  return await response.text();
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to send OTP");
  }

  return await response.text();
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Invalid OTP");
  }

  return await response.text();
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to reset password");
  }

  return await response.text();
};

export const authenticatedRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);

  if (response.status === 401) {
    // Token expired
    localStorage.removeItem("jwtToken");
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return await response.json();
};
