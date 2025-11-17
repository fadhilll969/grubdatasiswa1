import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/kls";

const Tmbhkls = () => {
  const navigate = useNavigate();
  const { kelas: paramKelas, id } = useParams();
  const [formData, setFormData] = useState({
    kelas: "",
    jurusan: "",
  });

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/${id}`)
        .then(res => setFormData({
          kelas: res.data.kelas,
          jurusan: res.data.jurusan,
        }))
        .catch(err => console.error("Gagal mengambil data:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Data kelas ${formData.kelas} ${formData.jurusan} berhasil diperbarui.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.post(API_URL, formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Data kelas ${formData.kelas} ${formData.jurusan} berhasil ditambahkan.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
      navigate("/kelas");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-20">
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            {id ? "Edit" : "Tambah"} Data Kelas
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">kelas</label>
              <input
                type="text"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan kelas"
              />
            </div>


            <div>
              <label className="block font-semibold mb-2">Jurusan</label>
              <input
                type="text"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan Jurusan"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/kelas")} // perbaiki navigasi
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
              >
                <i className="ri-save-3-line"></i> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tmbhkls;
