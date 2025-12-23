import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import axios from "axios";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const Tagihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
       setData(response.data.reverse());
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Gagal", "Tidak dapat memuat data tagihan.", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const updateStatus = async (id, statusBaru) => {
    const result = await Swal.fire({
      title: "Konfirmasi Perubahan Status",
      text: `Apakah Anda yakin ingin mengubah status menjadi "${statusBaru}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`http://localhost:5000/coco/${id}`, {
        status: statusBaru,
      });

      Swal.fire("Berhasil", "Status berhasil diperbarui.", "success");

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: statusBaru } : item
        )
      );
    } catch (error) {
      Swal.fire("Gagal", "Tidak dapat memperbarui status.", "error");
      console.error(error);
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/coco/${id}`);
        Swal.fire("Berhasil", "Data telah dihapus.", "success");

        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
        console.error("Gagal menghapus data:", error);
      }
    }
  };


  const filteredData = data.filter((item) => {
    const cocokNama = (item.nama || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const cocokStatus =
      filterStatus === "Semua" || item.status === filterStatus;

    return cocokNama && cocokStatus;
  });

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
              <i className="ri-wallet-3-line text-white text-2xl"></i>
              <h3 className="text-2xl font-semibold text-white">
                Manajemen Tagihan Siswa
              </h3>
            </div>

            <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-1/3">
                <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border-2 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 w-full md:w-1/4"
              >
                <option value="Semua">Semua Status</option>
                <option value="Sudah Bayar">Sudah Bayar</option>
                <option value="Belum Bayar">Belum Bayar</option>
              </select>

              <button
                className="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full md:w-auto flex items-center justify-center gap-2"
                onClick={() => navigate("/p")}
              >
                <i className="ri-add-circle-line text-lg"></i> Tambah Tagihan
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center mt-6 text-gray-700">Memuat data...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-sky-600 text-left text-white">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Jenis Tagihan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"
                          } hover:bg-sky-100 transition`}
                      >
                        <td className="py-3 text-center">{index + 1}</td>
                        <td className="py-3">{item.nama || "-"}</td>
                        <td className="py-3 text-right">{item.email || "-"}</td>

                        <td className="py-3 text-right">
                          Rp {Number(item.jumlah || 0).toLocaleString("id-ID")}
                        </td>

                        <td className="py-3 px-4">{item.jenisTagihan || "-"}</td>

                        <td className="py-3 text-center font-semibold">
                          <span
                            className={
                              item.status === "Sudah Bayar"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {item.status || "Belum Bayar"}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          {formatTanggal(item.tanggal)}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">

                            {item.status === "Sudah Bayar" ? (
                              <button
                                className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition"
                                onClick={() =>
                                  updateStatus(item.id, "Belum Bayar")
                                }
                              >
                                <i className="ri-refresh-line"></i>
                              </button>
                            ) : (
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition"
                                onClick={() =>
                                  updateStatus(item.id, "Sudah Bayar")
                                }
                              >
                                <i className="ri-refresh-line"></i>
                              </button>
                            )}

                            <button
                              className="bg-sky-600 text-white px-2 py-1 rounded-lg hover:bg-sky-700 transition"
                              onClick={() => navigate(`/ed/${item.id}`)}
                            >
                              <i className="ri-edit-2-line text-sm"></i>
                            </button>

                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="ri-delete-bin-6-line text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-5 text-gray-500 italic"
                      >
                        Tidak terdapat data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tagihan;
