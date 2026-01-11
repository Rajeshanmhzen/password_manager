import axios from "axios";
import { getURL } from "@/utils/GetURL";

export const register = async (formData) => {
  try {
    const res = await axios.post(`${getURL()}/users/register`, formData);
    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", formData.username);
    localStorage.setItem("email", formData.email);

    return {
      status: res.status,
      message: data.message,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response?.status || 500,
      message: err.response?.data?.message || "Registration failed",
    };
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(`${getURL()}/users/login`, formData);
    const data = res.data;

    localStorage.setItem("otpToken", data.token);

    return {
      status: res.status,
      message: data.message,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response?.status || 500,
      message: err.response?.data?.message || "Login failed",
    };
  }
};

export const verifyOTP = async (formData) => {
  try {
    const otpToken = localStorage.getItem("otpToken");
    if (!otpToken) return;

    const res = await axios.post(`${getURL()}/users/verify-otp`, formData, {
      headers: { Authorization: `Bearer ${otpToken}` },
    });
    const data = res.data;
    localStorage.setItem("token", data.token);
    return {
      status: res.status,
      message: data.message,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response?.status || 500,
      message: err.response?.data?.message || "OTP verification failed",
    };
  }
};

export const addPassword = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(`${getURL()}/passwords`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const removePassword = async (formData, id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `${getURL()}/passwords/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data.payload,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response.status,
      message: err.response.data.message,
    };
  }
};

export const getPasswords = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${getURL()}/passwords?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    return {
      status: res.status,
      message: data.message,
      user: data,
    };
  } catch (err) {
    console.error(err);
    return {
      status: err.response?.status || 500,
      message: err.response?.data?.message || "Failed to fetch passwords",
    };
  }
};
