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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/coco/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire("Error", "Gagal mengambil data tagihan", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch(`http://localhost:5000/coco/${id}`, formData);
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Jenis Tagihan</label>
              <select
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
              >
                <option value="spp">SPP</option>
                <option value="uang gedung">Uang Gedung</option>
                <option value="seragam">Seragam</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Status Pembayaran</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
              >
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Sudah Bayar">Sudah Bayar</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/o")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600 transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-3-line"></i> Simpan Perubahan
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
