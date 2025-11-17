import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/kls";

const Kelas = () => {
  const navigate = useNavigate();
  const { kelas: kelasParam } = useParams();
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        let data = res.data;

        if (kelasParam) {
          data = data.filter(item => item.kelas === kelasParam);
        }

        setKelasList(data);
      } catch (error) {
        console.error("Gagal mengambil data kelas:", error);
        Swal.fire({ icon: "error", title: "Gagal mengambil data kelas" });
      } finally {
        setLoading(false);
      }
    };

    fetchKelas();
  }, [kelasParam]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/${id}`)
          .then(() => {
            setKelasList(prev => prev.filter(item => item.id !== id));
            Swal.fire({ icon: "success", title: "Data Terhapus!", timer: 1500, showConfirmButton: false });
          })
          .catch(() => Swal.fire({ icon: "error", title: "Gagal menghapus data" }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-sky-200 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
            <h3 className="text-2xl font-semibold text-white">
              {kelasParam ? `Kelas ${kelasParam}` : "Semua Kelas"}
            </h3>
          </div>

          <div className="flex justify-end p-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/tambahkelas")}
            >
              <i className="ri-add-circle-line text-lg"></i>
              Tambah Kelas
            </button>
          </div>
        </div>

        <div className="rounded-xl mt-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Memuat data...</div>
          ) : (
            <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md text-center">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Jurusan</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelasList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-gray-500">Tidak ada data</td>
                  </tr>
                ) : (
                  kelasList.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.kelas}</td>
                      <td className="py-3 px-4">{item.jurusan}</td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button
                          className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition flex items-center gap-1"
                          onClick={() => navigate(`/editkelas/${item.id}`)}
                        >
                          <i className="ri-edit-2-line text-sm"></i> Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="ri-delete-bin-6-line text-sm"></i> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kelas;
