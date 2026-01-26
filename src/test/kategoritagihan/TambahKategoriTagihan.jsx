import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Dasbor from "../Dasbor";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/kategoritagihan`;

const TambahKategoriTagihan = () => {
  const navigate = useNavigate();
  const [kategori, setKategori] = useState({ nama_kategori: "", keterangan: "", aktif: true });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kategori.nama_kategori.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Nama kategori wajib diisi"
      });
      return;
    }

    try {
      await axios.post(API_URL, kategori);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil ditambahkan"
      }).then(() => navigate("/kategoriTagihan"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambahkan kategori"
      });
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-28">
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Tambah Kategori Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">Nama Kategori</label>
              <input
                type="text"
                name="nama_kategori"
                value={kategori.nama_kategori}
                onChange={(e) => setKategori({ ...kategori, nama_kategori: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Keterangan</label>
              <textarea
                name="keterangan"
                value={kategori.keterangan}
                onChange={(e) => setKategori({ ...kategori, keterangan: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan keterangan"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/kategoriTagihan")}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
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

export default TambahKategoriTagihan;
