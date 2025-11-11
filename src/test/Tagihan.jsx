import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import axios from "axios";
import Swal from "sweetalert2";

const Tagihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterOptions = ["Sudah Bayar", "Belum Bayar"];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Semua");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
      setData(response.data);
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi Penghapusan",
      text: "Apakah Anda yakin ingin menghapus data tagihan ini?",
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
        Swal.fire("Berhasil", "Data tagihan telah dihapus.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleBayar = async (id, currentStatus) => {
    if (currentStatus === "Sudah Bayar") {
      return Swal.fire({
        icon: "info",
        title: "Tagihan telah lunas",
        text: "Data pembayaran sudah tercatat.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    const result = await Swal.fire({
      title: "Konfirmasi Pembayaran",
      text: "Apakah Anda ingin menandai tagihan ini sebagai sudah dibayar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Tandai Lunas",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/coco/${id}`, {
          status: "Sudah Bayar",
        });
        Swal.fire("Berhasil", "Status pembayaran berhasil diperbarui.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal", "Tidak dapat memperbarui status pembayaran.", "error");
        console.error("Gagal memperbarui status:", error);
      }
    }
  };

  const handleBatalkan = async (id) => {
    const result = await Swal.fire({
      title: "Batalkan Status Pembayaran?",
      text: "Status pembayaran akan diubah menjadi 'Belum Bayar'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/coco/${id}`, {
          status: "Belum Bayar",
        });
        Swal.fire("Berhasil", "Status pembayaran telah dibatalkan.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal", "Tidak dapat membatalkan status pembayaran.", "error");
        console.error("Gagal membatalkan status:", error);
      }
    }
  };

  const filteredData = data.filter((item) => {
    const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      searchCategory === "Semua" || item.status === searchCategory;
    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-sky-700 py-4 px-6 flex items-center justify-center gap-2">
              <i className="ri-wallet-3-line text-white text-2xl"></i>
              <h3 className="text-2xl font-semibold text-white">Manajemen Tagihan</h3>
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
                className="p-2 border-2 rounded-lg w-full md:w-1/3 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="Semua">Semua</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                className="p-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full md:w-auto flex items-center justify-center gap-2"
                onClick={() => navigate("/p")}
              >
                <i className="ri-add-circle-line text-lg"></i>
                Tambah Tagihan
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center mt-6 text-gray-700">Memuat data tagihan...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-sky-600 text-center text-white">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama</th>
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
                        <td className="py-3 text-center px-4">{index + 1}</td>
                        <td className="py-3 px-4">{item.nama}</td>
                        <td className="py-3 px-4 text-right">
                          Rp {Number(item.jumlah).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.jenisTagihan}
                        </td>
                        
                        <td
                          className={`py-3 px-4 text-center font-semibold ${item.status === "Sudah Bayar"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {item.status || "Belum Bayar"}
                        </td>
                         <td className="py-3 px-4">{item.tanggal}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {item.status === "Sudah Bayar" ? (
                              <button
                                className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition flex items-center gap-1"
                                onClick={() => handleBatalkan(item.id)}
                              >
                                <i className="ri-arrow-go-back-line text-sm"></i>
                                Batal
                              </button>
                            ) : (
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                                onClick={() =>
                                  handleBayar(item.id, item.status)
                                }
                              >
                                <i className="ri-money-dollar-circle-line text-sm"></i>
                                Lunas
                              </button>
                            )}
                            <button
                              className="bg-sky-600 text-white px-2 py-1 rounded-lg hover:bg-sky-700 transition flex items-center gap-1"
                              onClick={() => navigate(`/ed/${item.id}`)}
                            >
                              <i className="ri-edit-2-line text-sm"></i> Ubah
                            </button>
                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="ri-delete-bin-6-line text-sm"></i>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-5 text-gray-500 italic"
                      >
                        Tidak terdapat data tagihan.
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
