import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";


const Tmbahkategori = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_kategori: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_kategori.trim() || !formData.keterangan.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Semua kolom wajib diisi",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/kategori-data", formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori baru berhasil disimpan!",
      }).then(() => navigate("/kategori"));
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
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

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-20">
          <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
            Tambah Kategori
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                name="nama_kategori"
                value={formData.nama_kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Keterangan
              </label>
              <input
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                placeholder="Masukkan keterangan kategori">
              </input>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => navigate("/kategori")}
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
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

export default Tmbahkategori;
