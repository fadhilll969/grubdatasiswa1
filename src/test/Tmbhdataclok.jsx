import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dasbor from "./Dasbor";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5000/clok";

const Tmbhdataclok = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    kategori_nama: "",
    aktif: false, // default false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.kategori_nama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama kategori wajib diisi",
      });
      return;
    }

    try {
      await axios.post(API_URL, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori baru berhasil disimpan!",
      }).then(() => navigate("/datakategori"));
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Pastikan server berjalan dengan benar.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white w-200 ml-27 mt-40 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-add-circle-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">Tambah Kategori</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nama Kategori</label>
              <input
                type="text"
                name="kategori_nama"
                value={formData.kategori_nama}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan nama kategori"
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
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tmbhdataclok;
