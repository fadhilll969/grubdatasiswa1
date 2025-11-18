import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Dasbor from "./Dasbor";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const EditTagihan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jumlah: "",
    jenisTagihan: "",
    tanggal: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatRupiah = (angka) => {
    if (!angka) return "";
    return "Rp " + Number(angka).toLocaleString("id-ID");
  };

  const formatTanggalInput = (tanggal) => {
    if (!tanggal) return "";
    const date = new Date(tanggal);
    if (isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchTagihan = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/coco/${id}`);
        setFormData({
          nama: res.data.nama || "",
          email: res.data.email || "",
          jumlah: res.data.jumlah || "",
          jenisTagihan: res.data.jenisTagihan || "",
          tanggal: formatTanggalInput(res.data.tanggal),
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire("Error", "Gagal mengambil data tagihan", "error");
      }
    };
    fetchTagihan();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nama.trim() ||
      !formData.jumlah ||
      !formData.jenisTagihan.trim() ||
      !formData.tanggal
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Semua kolom wajib diisi sebelum menyimpan!",
      });
    }

    try {
      setLoading(true);
      await axios.patch(`http://localhost:5000/coco/${id}`, {
        ...formData,
        jumlah: Number(formData.jumlah),
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Data tagihan berhasil diperbarui.",
        icon: "success",
      }).then(() => navigate("/o"));
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui data", "error");
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
            Edit Tagihan
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
                placeholder="Masukkan nama"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="Masukkan email"
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
                placeholder="Masukkan jumlah tagihan"
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
                <option value="">-- Pilih Jenis Tagihan --</option>
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
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
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

export default EditTagihan;
