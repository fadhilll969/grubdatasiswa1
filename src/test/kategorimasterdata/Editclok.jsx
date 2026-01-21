import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";

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
        navigate("/kategori/data");
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
      navigate("/kategori/data");
    } catch (error) {
      console.error("Gagal memperbarui kategori:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data",
      });
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-28">
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Edit Kategori
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

             <div>
              <label className="block font-semibold mb-2">Nama Kategori</label>
              <input
                type="text"
                name="kategori_nama"
                value={kategori.kategori_nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan Nama Kategori"
              />
            </div>

             <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/kategori/data")}
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

export default Editclok;
