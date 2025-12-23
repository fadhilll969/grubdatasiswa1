import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Dasbor from "./Dasbor";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const Rodd = () => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/doss";

  const filterOptions = ["Siswa", "Karyawan", "Guru"];

  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Semua");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setDataList(res.data.reverse());
      })
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

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
        axios
          .delete(`${API_URL}/${id}`)
          .then(() => {
            setDataList((prev) => prev.filter((item) => item.id !== id));
            Swal.fire({
              icon: "success",
              title: "Data Terhapus!",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal menghapus data dari server.",
            });
          });
      }
    });
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Siswa":
        return <i className="ri-graduation-cap-line text-sky-600 mr-1"></i>;
      case "Guru":
        return <i className="ri-book-2-line text-green-600 mr-1"></i>;
      case "Karyawan":
        return <i className="ri-briefcase-3-line text-yellow-600 mr-1"></i>;
      default:
        return <i className="ri-user-line text-gray-500 mr-1"></i>;
    }
  };

  const filteredData = dataList.filter((data) => {
    const matchName = data.nama
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchCategory =
      searchCategory === "Semua" || data.kategori === searchCategory;

    return matchName && matchCategory;
  });

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex">
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-lg mb-4">
            <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2 rounded-t-xl">
              <i className="ri-table-line text-white text-2xl"></i>
              <h3 className="text-2xl font-semibold text-white">Data</h3>
            </div>

            <div className="p-5 flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border-2 rounded-lg w-full focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <select
                className="p-2 border-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-sky-400"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <button
                className="p-2 px-4 bg-blue-600 ml-60 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                onClick={() => navigate("/t")}
              >
                <i className="ri-add-circle-line"></i>
                Tambah Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
            <table className="min-w-full table-auto text-gray-700">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4  text-left">Kelas</th>
                  <th className="py-3 px-4  text-left">Jurusan / Mapel</th>
                  <th className="py-3 px-4  text-left">Nomor Unik</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4  text-left">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <tr
                      key={data.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"
                        } hover:bg-sky-100`}
                    >
                      <td className="py-3 px-4 text-center">{index + 1}</td>
                      <td className="py-3 px-4 flex items-center">
                        {getCategoryIcon(data.kategori)}
                        {data.kategori}
                      </td>
                      <td className="py-3 px-4">{data.nama}</td>
                      <td className="py-3 px-4  ">
                        {data.kategori === "Siswa" ? data.kelas : "-"}
                      </td>
                      <td className="py-3 px-4  r">
                        {data.kategori === "Siswa"
                          ? data.jurusan
                          : data.kategori === "Guru"
                            ? data.mapel
                            : "-"}
                      </td>
                      <td className="py-3 px-4">{data.nomor || "-"}</td>
                      <td className="py-3 px-4 text-right">{data.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 flex items-center gap-1"
                            onClick={() => navigate(`/edit/${data.id}`)}
                          >
                            <i className="ri-edit-2-line"></i> Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                            onClick={() => handleDelete(data.id)}
                          >
                            <i className="ri-delete-bin-line"></i> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rodd;
