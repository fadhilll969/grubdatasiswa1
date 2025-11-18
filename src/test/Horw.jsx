import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import Swal from "sweetalert2";

function Horw() {
  const nav = useNavigate();

  const [jumlah, setJumlah] = useState({
    total: 0,
    siswa: 0,
    guru: 0,
    karyawan: 0,
  });

  const [dataList, setDataList] = useState([]);
  const [dataTagihan, setDataTagihan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalCount: 0,
    totalAmount: 0,
    sudahBayarCount: 0,
    sudahBayarAmount: 0,
    belumBayarCount: 0,
    belumBayarAmount: 0,
  });

  const [searchTermUser, setSearchTermUser] = useState("");
  const [searchCategoryUser, setSearchCategoryUser] = useState("Semua");
  const [searchClass, setSearchClass] = useState("Semua");
  const [searchJurusan, setSearchJurusan] = useState("Semua");
  const [searchMapel, setSearchMapel] = useState("");

  const [searchTermTagihan, setSearchTermTagihan] = useState("");
  const [searchStatusTagihan, setSearchStatusTagihan] = useState("Semua");

  const [classOptions, setClassOptions] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [mapelOptions, setMapelOptions] = useState([]);

  const filterOptionsUser = ["Siswa", "Guru", "Karyawan"];
  const filterOptionsTagihan = ["Sudah Bayar", "Belum Bayar"];

  const formatRupiah = (num) =>
    "Rp " + Number(num || 0).toLocaleString("id-ID");

  const fetchDataTagihan = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
      const hasil = response.data || [];
      setDataTagihan(hasil);

      const totalAmount = hasil.reduce(
        (sum, i) => sum + Number(i.jumlah || 0),
        0
      );

      const sudahBayar = hasil.filter((i) => i.status === "Sudah Bayar");
      const sudahBayarAmount = sudahBayar.reduce(
        (sum, i) => sum + Number(i.jumlah || 0),
        0
      );

      const belumBayarCount = hasil.length - sudahBayar.length;
      const belumBayarAmount = totalAmount - sudahBayarAmount;

      setSummary({
        totalCount: hasil.length,
        totalAmount,
        sudahBayarCount: sudahBayar.length,
        sudahBayarAmount,
        belumBayarCount,
        belumBayarAmount,
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Gagal", "Tidak dapat memuat data tagihan.", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const ambilDataUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/doss");
        const data = (await res.json()) || [];

        const siswa = data.filter((item) => item.kategori === "Siswa");
        const guru = data.filter((item) => item.kategori === "Guru");
        const karyawan = data.filter((item) => item.kategori === "Karyawan");

        setJumlah({
          siswa: siswa.length,
          guru: guru.length,
          karyawan: karyawan.length,
          total: siswa.length + guru.length + karyawan.length,
        });

        setDataList(data);
        setClassOptions([...new Set(siswa.map((s) => s.kelas).filter(Boolean))]);
        setJurusanOptions([...new Set(siswa.map((s) => s.jurusan).filter(Boolean))]);
        setMapelOptions([...new Set(guru.map((g) => g.mapel).filter(Boolean))]);
      } catch (error) {
        console.log("Gagal ambil data user", error);
      }
    };

    ambilDataUser();
    fetchDataTagihan();
  }, []);

  const filteredDataUser = dataList.filter((data) => {
    const matchName = data.nama?.toLowerCase().includes(searchTermUser.toLowerCase());
    const matchCategory =
      searchCategoryUser === "Semua" || data.kategori === searchCategoryUser;
    const matchClass = searchClass === "Semua" || data.kelas === searchClass;
    const matchJurusan =
      searchCategoryUser !== "Siswa" ||
      searchJurusan === "Semua" ||
      data.jurusan === searchJurusan;
    const matchMapel =
      searchCategoryUser !== "Guru" ||
      searchMapel === "" ||
      data.mapel?.toLowerCase().includes(searchMapel.toLowerCase());

    return matchName && matchCategory && matchClass && matchJurusan && matchMapel;
  });

  const filteredDataTagihan = dataTagihan.filter((item) => {
    const nameMatch = item.nama?.toLowerCase().includes(searchTermTagihan.toLowerCase());
    const statusItem = item.status?.trim() !== "" ? item.status : "Belum Bayar";
    const statusMatch =
      searchStatusTagihan === "Semua" || statusItem === searchStatusTagihan;
    return nameMatch && statusMatch;
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-700">
        Loading...
      </div>
    );
  }
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal; // jika format tidak valid, tampilkan apa adanya

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-sky-200">
      <Dasbor />

      <div className="flex-1 p-8 font-sans">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-2">
          <i className="ri-dashboard-line text-sky-600"></i> Dashboard Sekolah
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-10">
          {["total", "siswa", "guru", "karyawan"].map((cat, idx) => {
            const colors = {
              total: "sky",
              siswa: "blue",
              guru: "green",
              karyawan: "yellow",
            };
            const icons = {
              total: "ri-database-2-line",
              siswa: "ri-graduation-cap-line",
              guru: "ri-book-2-line",
              karyawan: "ri-briefcase-3-line",
            };
            return (
              <div
                key={cat}
                className={`bg-white border-t-4 border-${colors[cat]}-600 rounded-lg shadow-md p-6 text-center`}
              >
                <i className={`${icons[cat]} text-3xl text-${colors[cat]}-600`}></i>
                <h3 className="text-xl font-semibold mt-2">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <p className="text-3xl font-bold my-3">{jumlah[cat]}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {[
            { title: "Total Tagihan", value: summary.totalCount, amount: summary.totalAmount, color: "sky", icon: "ri-database-2-line" },
            { title: "Sudah Lunas", value: summary.sudahBayarCount, amount: summary.sudahBayarAmount, color: "green", icon: "ri-check-double-line" },
            { title: "Belum Lunas", value: summary.belumBayarCount, amount: summary.belumBayarAmount, color: "red", icon: "ri-close-circle-line" },
          ].map((item, idx) => (
            <div key={idx} className={`bg-white border-t-4 border-${item.color}-500 rounded-lg shadow-md p-6 text-center`}>
              <i className={`${item.icon} text-3xl text-${item.color}-500`}></i>
              <h3 className="text-xl font-semibold mt-2 text-gray-700">{item.title}</h3>
              <p className={`text-3xl font-bold my-1 ${item.color === "red" ? "text-red-600" : item.color === "green" ? "text-green-600" : ""}`}>
                {item.value}
              </p>
              <p className={`text-lg font-semibold ${item.color === "red" ? "text-red-700" : item.color === "green" ? "text-green-700" : "text-gray-600"}`}>
                {formatRupiah(item.amount)}
              </p>
            </div>
          ))}
        </div>

        <h1 className="text-4xl mt-10 font-bold">Data Siswa / Guru / Karyawan</h1>
        <div className="flex flex-col md:flex-row gap-3 items-center mb-6 mt-5 flex-wrap">
          <div className="relative w-full md:w-1/3">
            <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Cari user berdasarkan nama..."
              value={searchTermUser}
              onChange={(e) => setSearchTermUser(e.target.value)}
              className="p-2 pl-10 border rounded w-full bg-white focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <select
            className="p-2 border rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400"
            value={searchCategoryUser}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setSearchCategoryUser(selectedCategory);
              setSearchClass("Semua");
              setSearchJurusan("Semua");
              setSearchMapel("");
            }}
          >
            <option value="Semua">Semua Kategori</option>
            {filterOptionsUser.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          {searchCategoryUser === "Siswa" && (
            <>
              <select
                className="p-2 border rounded w-full md:w-1/5 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
              >
                <option value="Semua">Semua Kelas</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <select
                className="p-2 border rounded w-full md:w-1/5 bg-white focus:ring-2 focus:ring-sky-400"
                value={searchJurusan}
                onChange={(e) => setSearchJurusan(e.target.value)}
              >
                <option value="Semua">Semua Jurusan</option>
                {jurusanOptions.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </>
          )}

          {searchCategoryUser === "Guru" && (
            <input
              type="text"
              placeholder="Cari Mapel..."
              value={searchMapel}
              onChange={(e) => setSearchMapel(e.target.value)}
              className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
            />
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="table-auto w-full text-gray-700">
            <thead className="bg-sky-600 text-white text-left">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Jurusan/Mapel</th>
                <th className="py-3 px-4">Nomer</th>
                <th className="py-3 px-4">Email</th>
              </tr>
            </thead>

            <tbody>
              {filteredDataUser.length > 0 ? (
                filteredDataUser.map((user, index) => (
                  <tr
                    key={user.id || index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100 transition`}
                  >
                    <td className="py-3 text-center px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      {getCategoryIcon(user.kategori)}
                      {user.kategori || "-"}
                    </td>
                    <td className="py-3 px-4">{user.nama || "-"}</td>
                    <td className="py-3 px-4 text-center">{user.kelas || "-"}</td>
                    <td className="text-center">{user.kategori === "Siswa" ? (user.jurusan || "-") : (user.mapel || "-")}</td>
                    <td className="py-3 px-4">{user.nomer || "-"}</td>
                    <td className="py-3 px-4 text-right">{user.email || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-gray-500 italic">
                    Tidak terdapat data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h1 className="text-4xl mt-10 font-bold">Daftar Tagihan</h1>

        <div className="flex flex-col md:flex-row gap-3 items-center my-6">
          <div className="relative w-full md:w-1/3">
            <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Cari tagihan berdasarkan nama..."
              value={searchTermTagihan}
              onChange={(e) => setSearchTermTagihan(e.target.value)}
              className="p-2 pl-10 border rounded w-full bg-white focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <select
            className="p-2 border rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400"
            value={searchStatusTagihan}
            onChange={(e) => setSearchStatusTagihan(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            {filterOptionsTagihan.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-10">
          <table className="table-auto w-full text-gray-700">
            <thead className="bg-sky-600 text-white text-left">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">email</th>
                <th className="py-3 px-4">Jumlah</th>
                <th className="py-3 px-4">Jenis Tagihan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {filteredDataTagihan.length > 0 ? (
                filteredDataTagihan.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100 transition`}
                  >
                    <td className="py-3 text-center px-4">{index + 1}</td>
                    <td className="py-3 px-4">{item.nama || "-"}</td>
                    <td className="py-3 text-right">{item.email || "-"}</td>
                    <td className="py-3 px-4 text-right">{formatRupiah(item.jumlah)}</td>
                    <td className="py-3 px-4 text-center">{item.jenisTagihan || "-"}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${item.status === "Sudah Bayar" ? "text-green-600" : "text-red-600"}`}>
                      {item.status || "Belum Bayar"}
                    </td>
                    <td className="py-3 px-4 text-right">{formatTanggal(item.tanggal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-gray-500 italic">
                    Tidak terdapat data tagihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Horw;
