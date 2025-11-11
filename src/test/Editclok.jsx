import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";

const API_URL = "http://localhost:5000/clok";

const Editclok = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kategori, setKategori] = useState({ kategori_nama: "", aktif: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setKategori({
          kategori_nama: res.data.kategori_nama || "",
          aktif: res.data.aktif || false,
        });
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Data kategori tidak ditemukan",
        });
        navigate("/datakategori");
      }
    };
    fetchKategori();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKategori((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kategori.kategori_nama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama kategori wajib diisi",
      });
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, kategori);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/datakategori");
    } catch (error) {
      console.error("Gagal memperbarui kategori:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white w-200 ml-27 mt-40 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-edit-2-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">Edit Kategori</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nama Kategori</label>
              <input
                type="text"
                name="kategori_nama"
                value={kategori.kategori_nama}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan Nama Kategori"
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition duration-200 flex items-center justify-center gap-2"
            >
              <i className="ri-save-3-line"></i> Simpan
            </button>

            <button
              type="button"
              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2"
              onClick={() => navigate("/datakategori")}
            >
              <i className="ri-arrow-left-line"></i> Batal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editclok;
