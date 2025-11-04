import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dasbor from "./Dasbor";
import Swal from "sweetalert2";

const TmbhdataTgihan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    jumlah: "",
    jenisTagihan: "",
    status: "Belum Bayar",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.jumlah || !formData.jenisTagihan) {
      Swal.fire("Error", "Semua field wajib diisi!", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/coco", {
        nama: formData.nama,
        jumlah: Number(formData.jumlah),
        jenisTagihan: formData.jenisTagihan,
        status: formData.status,
      });

      Swal.fire("Berhasil", "Data berhasil disimpan!", "success").then(() => {
        navigate("/o");
      });
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire(
        "Gagal",
        "Gagal menyimpan data. Pastikan server berjalan dengan benar.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-add-circle-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">Tambah Data Tagihan</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan nama pelanggan"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Jumlah (Rp)</label>
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan jumlah tagihan"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Jenis Tagihan</label>
              <select
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                required
              >
                <option value="">Pilih jenis tagihan</option>
                <option value="spp">SPP</option>
                <option value="uang gedung">Uang Gedung</option>
                <option value="seragam">Seragam</option>
              </select>
            </div>

          

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/o")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-3-line"></i> Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TmbhdataTgihan;
