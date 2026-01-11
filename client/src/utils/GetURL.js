export const getURL = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api-password-manager-eg47.onrender.com/";
};
