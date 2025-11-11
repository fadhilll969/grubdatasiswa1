import React, { useState, useEffect } from "react";
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
    tanggal: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get("http://localhost:5000/kategori-data");
        const aktifKategori = res.data.filter(item => item.aktif);
        setKategoriList(aktifKategori);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jumlah") {
      const angka = value.replace(/\D/g, "");  
      setFormData((prev) => ({ ...prev, [name]: angka }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatRupiah = (angka) =>
    angka ? "Rp " + angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nama.trim() ||
      !formData.jumlah ||
      Number(formData.jumlah) <= 0 ||
      !formData.jenisTagihan.trim() ||
      !formData.tanggal
    ) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Semua kolom wajib diisi",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/coco", {
        nama: formData.nama.trim(),
        jumlah: Number(formData.jumlah),
        jenisTagihan: formData.jenisTagihan.trim(),
        tanggal: formData.tanggal,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tagihan berhasil disimpan!",
        confirmButtonText: "OK",
      }).then(() => navigate("/o"));
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Pastikan server berjalan dengan benar.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto mt-10 overflow-hidden">
          <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-add-circle-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">
              Tambah Data Tagihan
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan Nama"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Jumlah
              </label>
              <input
                type="text"
                name="jumlah"
                value={formatRupiah(formData.jumlah)}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan Jumlah Tagihan"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Jenis Tagihan
              </label>
              <select
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori.id} value={kategori.nama_kategori}>
                    {kategori.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition duration-200 flex items-center justify-center gap-2"
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

            <button
              type="button"
              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2"
              onClick={() => navigate("/o")}
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TmbhdataTgihan;
