import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../config/api";

const LOGIN_URL = `${BASE_URL}/users`;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        formData
      );

      Swal.fire({
        title: "Login Berhasil!",
        icon: "success",
        confirmButtonText: "OK"
      });

      navigate("/w");
    } catch (error) {
      Swal.fire({
        title: "Login gagal",
        text: error.response?.data || "Email atau password salah",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-600">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? "Mengirim..." : "Masuk"}
          </button>
        </form>

        <p className="text-center mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-sky-500 font-bold underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
