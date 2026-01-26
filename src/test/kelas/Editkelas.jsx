import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/kelas`;

const Editkelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kelas: "",
    jurusan: "",
  });

  // ✅ AMBIL DATA BERDASARKAN ID
  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(res => {
        setFormData({
          kelas: res.data.kelas,
          jurusan: res.data.jurusan,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Data tidak ditemukan",
        });
        navigate("/kelas");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ UPDATE DATA
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/${id}`, formData)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Data berhasil diperbarui!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/kelas");
      })
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Gagal memperbarui data",
        })
      );
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-55 mt-20">
          <h2 className="text-2xl font-bold mb-6 text-sky-700 text-center">
            Edit Kelas
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">Kelas</label>
              <input
                type="text"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan kelas"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Jurusan</label>
              <input
                type="text"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Masukkan Jurusan"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/kelas")}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <i className="ri-arrow-left-line"></i> Kembali
              </button>
              <button
                type="submit"
                className="bg-sky-600 text-white px-4 py-2 rounded-lg"
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

export default Editkelas;
