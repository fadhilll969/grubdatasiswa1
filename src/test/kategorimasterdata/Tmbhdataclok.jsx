import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dasbor from "../Dasbor";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/clok";

const Tmbhdataclok = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    kategori_nama: "",
    aktif: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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
      }).then(() => navigate("/kategori/data"));
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

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-28">

          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Tambah Kategori
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-semibold mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                name="kategori_nama"
                value={formData.kategori_nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan nama kategori"
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

export default Tmbhdataclok;
