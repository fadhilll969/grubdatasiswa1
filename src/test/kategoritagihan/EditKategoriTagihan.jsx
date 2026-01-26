import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/kategoritagihan`;

const EditKategoriTagihan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    nama_kategori: "",
    keterangan: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setData({
          nama_kategori: res.data.nama_kategori || "",
          keterangan: res.data.keterangan || "",
        });
        setLoading(false);
      } catch {
        Swal.fire("Error", "Gagal mengambil data", "error");
        navigate("/kategoriTagihan");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.nama_kategori.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama kategori wajib diisi",
      });
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, data);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/kategoriTagihan");
    } catch {
      Swal.fire("Error", "Gagal mengupdate kategori", "error");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />

      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-28">
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Edit Kategori Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">Nama Kategori</label>
              <input
                type="text"
                name="nama_kategori"
                value={data.nama_kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan Nama Kategori"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Keterangan</label>
              <textarea
                name="keterangan"
                value={data.keterangan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan Keterangan"
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

export default EditKategoriTagihan;
