import { useEffect } from "react";

export default function ProtectedRoute({ route }) {
  useEffect(() => {
    if (!localStorage.getItem("token"))
      return window.location.replace("/login");
  }, []);

  return <>{route}</>;
}
