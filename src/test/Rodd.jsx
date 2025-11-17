import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Dasbor from "./Dasbor";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const Rodd = () => {
  const filterOptions = ["Siswa", "Karyawan", "Guru"];
  const classOptions = ["X", "XI", "XII"];
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Semua");
  const [searchClass, setSearchClass] = useState("Semua");
  const [searchJurusan, setSearchJurusan] = useState("Semua");
  const [searchMapel, setSearchMapel] = useState("");
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const API_URL = "http://localhost:5000/doss";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setDataList(res.data);

        const siswa = res.data.filter((item) => item.kategori === "Siswa");
        const jurusanUnik = [...new Set(siswa.map((s) => s.jurusan))];
        setJurusanOptions(jurusanUnik);
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
            setDataList(dataList.filter((item) => item.id !== id));
            Swal.fire({
              icon: "success",
              title: "Data Terhapus!",
              text: "Data berhasil dihapus.",
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
    const matchName = data.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = searchCategory === "Semua" || data.kategori === searchCategory;
    const matchClass = searchClass === "Semua" || data.kelas === searchClass;
    const matchJurusan = searchJurusan === "Semua" || data.jurusan === searchJurusan;
    const matchMapel =
      searchMapel === "" || (data.mapel && data.mapel.toLowerCase().includes(searchMapel.toLowerCase()));

    return (
      matchName &&
      matchCategory &&
      (searchCategory === "Guru" ? matchMapel : true) &&
      (searchCategory === "Siswa" ? matchClass && matchJurusan : true)
    );
  });

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="flex flex-col md:flex-row">
        <Dasbor />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
            <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
              <i className="ri-table-line text-white text-2xl"></i>
              <h3 className="text-2xl font-semibold text-white">Data</h3>
            </div>

            <div className="p-5 flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari Berdasarkan Nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <select
                className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchCategory}
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                  setSearchClass("Semua");
                  setSearchJurusan("Semua");
                  setSearchMapel("");
                }}
              >
                <option value="Semua">Semua Kategori</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {searchCategory === "Siswa" && (
                <>
                  <select
                    className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
                    value={searchClass}
                    onChange={(e) => setSearchClass(e.target.value)}
                  >
                    <option value="Semua">Semua Kelas</option>
                    {classOptions.map((kelas) => (
                      <option key={kelas} value={kelas}>
                        {kelas}
                      </option>
                    ))}
                  </select>

                  <select
                    className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
                    value={searchJurusan}
                    onChange={(e) => setSearchJurusan(e.target.value)}
                  >
                    <option value="Semua">Semua Jurusan</option>
                    {jurusanOptions.map((jurusan) => (
                      <option key={jurusan} value={jurusan}>
                        {jurusan}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {searchCategory === "Guru" && (
                <input
                  type="text"
                  placeholder="Cari Mapel..."
                  value={searchMapel}
                  onChange={(e) => setSearchMapel(e.target.value)}
                  className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
                />
              )}
            </div>
          </div>

          <div>
            <button
              className="p-2 px-4 mb-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full md:w-auto flex items-center gap-2"
              onClick={() => navigate("/t")}
            >
              <i className="ri-add-circle-line text-lg"></i>
              Tambah Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Kelas</th>
                  <th className="py-3 px-4 text-left">Jurusan/Mapel</th>
                  <th className="py-3 px-4 text-left">Nomer</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <tr
                      key={data.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100 transition`}
                    >
                      <td className="py-3 px-4 text-left">{index + 1}</td>
                      <td className="py-3 px-4 text-left">
                        {getCategoryIcon(data.kategori)} {data.kategori}
                      </td>
                      <td className="py-3 px-4 text-left">{data.nama}</td>
                      <td className="py-3 px-4 text-left">{data.kelas || "-"}</td>
                      <td className="py-3 px-4 text-left">
                        {data.kategori === "Siswa"
                          ? data.jurusan
                          : data.kategori === "Guru"
                          ? data.mapel
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-left">{data.nomer}</td>
                      <td className="py-3 px-4 text-left">{data.email}</td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex gap-2">
                          <button
                            className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition flex items-center gap-1"
                            onClick={() => navigate(`/edit/${data.id}`)}
                          >
                            <i className="ri-edit-2-line text-sm"></i> Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                            onClick={() => handleDelete(data.id)}
                          >
                            <i className="ri-delete-bin-6-line text-sm"></i> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-left py-5 text-gray-500 italic">
                      Tidak ada data yang cocok.
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
