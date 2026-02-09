import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";
import { BASE_URL } from "../../config/api";

const API_URL = `${BASE_URL}/kategoritagihan`;

const KategoriTagihan = () => {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = res.data.map(item => ({ ...item, aktif: item.aktif ?? false }));
        setKategoriList(data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data dari server", "error");
      }
    };
    fetchData();
  }, []);

   

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setKategoriList(prev => prev.filter(k => k.id !== id));
        Swal.fire({ icon: "success", title: "Terhapus!", timer: 1200, showConfirmButton: false });
      } catch {
        Swal.fire("Error", "Gagal menghapus data", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
            <i className="ri-database-2-line text-white text-2xl"></i>
            <h3 className="text-2xl font-semibold text-white">Kategori Tagihan</h3>
          </div>

          <div className="flex justify-end p-4">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/kategoriTagihan/tambah")}
            >
              <i className="ri-add-circle-line"></i>
              Tambah Kategori
            </button>
          </div>
        </div>

         <div className="rounded-xl mt-6 overflow-x-auto shadow-md bg-white">
          <table className="min-w-full border-separate border-spacing-0 text-center">
            <thead className="bg-sky-700 text-white">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 text-left px-4">Nama Kategori</th>
                <th className="py-3 text-left px-4">Keterangan</th>
                 <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kategoriList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-gray-500">Tidak ada data</td>
                </tr>
              ) : (
                kategoriList.map((item, idx) => (
                  <tr key={item.id} className="border-t hover:bg-sky-50">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 text-left px-4">{item.nama_kategori}</td>
                    <td className="py-3 text-left px-4">{item.keterangan || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600"
                          onClick={() => navigate(`/kategoriTagihan/edit/${item.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KategoriTagihan;
