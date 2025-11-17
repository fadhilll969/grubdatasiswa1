import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dasbor from "./Dasbor";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

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
        const aktifKategori = res.data.filter((item) => item.aktif);
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
      }).then(() => navigate("/o"));
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: "Pastikan server berjalan dengan benar.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-8">
          
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Tambah Data Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

             <div>
              <label className="block font-semibold mb-2">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan Nama"
              />
            </div>

             <div>
              <label className="block font-semibold mb-2">Jumlah</label>
              <input
                type="text"
                name="jumlah"
                value={formatRupiah(formData.jumlah)}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan Jumlah Tagihan"
              />
            </div>

             <div>
              <label className="block font-semibold mb-2">Jenis Tagihan</label>
              <select
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
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
              <label className="block font-semibold mb-2">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

             <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/o")}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
              >
              <i className="ri-arrow-left-line"></i> Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
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
