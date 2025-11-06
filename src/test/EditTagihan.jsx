import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Dasbor from "./Dasbor";
import Swal from "sweetalert2";

const EditTagihan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nama: "",
    jumlah: "",        
    jenisTagihan: "",
    status: "",
    tanggal: "",      
  });

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
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/coco/${id}`);
        setFormData({
          nama: res.data.nama || "",
          jumlah: res.data.jumlah || "",
          jenisTagihan: res.data.jenisTagihan || "",
          status: res.data.status || "",
          tanggal: formatTanggalInput(res.data.tanggal),
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire("Error", "Gagal mengambil data tagihan", "error");
      }
    };
    fetchData();
  }, [id]);

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

    if (!formData.nama.trim() || !formData.jumlah || !formData.jenisTagihan.trim() || !formData.tanggal) {
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
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/o");
      });
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
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg w-160 ml-45 mt-10 overflow-hidden">
          <div className="bg-sky-500 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-edit-2-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">Edit Tagihan</h3>
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
                placeholder="Masukkan nama"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Jumlah</label>
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
              <label className="block text-gray-700 font-medium mb-1">Jenis Tagihan</label>
              <input
                type="text"
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan jenis tagihan"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Tanggal</label>
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

export default EditTagihan;
