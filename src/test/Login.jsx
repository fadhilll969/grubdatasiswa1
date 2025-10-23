import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


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
      const response = await axios.post('http://localhost:5000/users', formData);
      console.log('Register success:', response.data);


      await Swal.fire({
        title: "Login Berhasil!",
        text: "",
        icon: "success",
        confirmButtonText: "OK"
      });


      navigate('/w');
    } catch (error) {
      console.error('Error register:', error);

      Swal.fire({
        title: "gagal",
        text: "Terjadi kesalahan saat mengirim data.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-600 bg-indigo-400">
      <div className="bg-white p-8 rounded-lg shadow-md w-90 h-110 max-w-sm mt-5">
        <h1 className="text-4xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit}>

          <div className="mb-4 mt-10">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan Email"
              required
            />
          </div>
          <div className="mb-6 mt-10">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              required
            />
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Masuk"}
            </button>
          </div>
          <div className="flex justify-between mt-5 ml-3">
            <h1 className="">
              Beluim Punya Akun?
              <button >
                <span className="font-bold ml-1 text-sky-400 underline">
                  <Link to="/k">
                    Daftar Sekarang
                  </Link>
                </span>
              </button>
            </h1>
          </div>
        </form>
      </div >
    </div >
  );
}

export default Login;
