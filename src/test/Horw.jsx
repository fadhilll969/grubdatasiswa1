import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import Swal from "sweetalert2";

function Horw() {
  const nav = useNavigate();

  const [jumlah, setJumlah] = useState({ total: 0, siswa: 0, guru: 0, karyawan: 0 });
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

  const [classOptions, setClassOptions] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [mapelOptions, setMapelOptions] = useState([]);

  const [searchTermTagihan, setSearchTermTagihan] = useState("");
  const [searchStatusTagihan, setSearchStatusTagihan] = useState("Semua");
  const filterOptionsTagihan = ["Sudah Bayar", "Belum Bayar"];

  const formatRupiah = (num) => "Rp " + Number(num || 0).toLocaleString("id-ID");

  const fetchDataTagihan = async () => {
    try {
      const response = await axios.get("http://localhost:5000/coco");
      const hasil = response.data || [];
      setDataTagihan(hasil.reverse());

      const totalAmount = hasil.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
      const sudahBayar = hasil.filter((i) => (i.status || "").toLowerCase() === "sudah bayar");
      const sudahBayarAmount = sudahBayar.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
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

  const formatDateUSA = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
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

        setDataList(data.reverse());
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

  const cleanStatus = (status) => {
    if (!status) return "Belum Bayar";
    const s = status.trim().toLowerCase();
    if (s === "sudah bayar") return "Sudah Bayar";
    if (s === "belum bayar") return "Belum Bayar";
    return "Belum Bayar";
  };

  const filteredDataUser = dataList.filter((data) => {
    const matchName = data.nama?.toLowerCase().includes(searchTermUser.toLowerCase());
    const matchCategory = searchCategoryUser === "Semua" || data.kategori === searchCategoryUser;
    const matchClass = searchCategoryUser !== "Siswa" || searchClass === "Semua" || data.kelas === searchClass;
    const matchJurusan = searchCategoryUser !== "Siswa" || searchJurusan === "Semua" || data.jurusan === searchJurusan;
    const matchMapel = searchCategoryUser !== "Guru" || searchMapel === "" || data.mapel?.toLowerCase().includes(searchMapel.toLowerCase());
    return matchName && matchCategory && matchClass && matchJurusan && matchMapel;
  });

  const filteredDataTagihan = dataTagihan.filter((item) => {
    const nameMatch = item.nama?.toLowerCase().includes(searchTermTagihan.toLowerCase());
    const statusMatch = searchStatusTagihan === "Semua" || cleanStatus(item.status) === searchStatusTagihan;
    return nameMatch && statusMatch;
  });

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Siswa":
        return <i className="ri-graduation-cap-line text-sky-600"></i>;
      case "Guru":
        return <i className="ri-book-2-line text-green-600"></i>;
      case "Karyawan":
        return <i className="ri-briefcase-3-line text-yellow-600"></i>;
      default:
        return <i className="ri-user-line text-gray-500"></i>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-sky-200">
      <Dasbor />
      <div className="flex-1 p-8 font-sans">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-2">
          <i className="ri-dashboard-line text-sky-600"></i> Dashboard Sekolah
        </h1>

         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-10">
          {["total", "siswa", "guru", "karyawan"].map((key) => {
            const colors = { total: "sky", siswa: "blue", guru: "green", karyawan: "yellow" };
            const icons = { total: "ri-database-2-line", siswa: "ri-graduation-cap-line", guru: "ri-book-2-line", karyawan: "ri-briefcase-3-line" };
            const labels = { total: "Total", siswa: "Siswa", guru: "Guru", karyawan: "Karyawan" };
            return (
              <div key={key} className={`bg-white border-t-4 border-${colors[key]}-600 rounded-lg shadow-md p-6 text-center`}>
                <i className={`${icons[key]} text-3xl text-${colors[key]}-600`}></i>
                <h3 className="text-xl font-semibold mt-2">{labels[key]}</h3>
                <p className="text-3xl font-bold my-3">{jumlah[key]}</p>
              </div>
            );
          })}
        </div>

         <h1 className="text-4xl mt-10 font-bold">Ringkasan Tagihan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {[
            { key: "total", label: "Total Tagihan", color: "sky", count: summary.totalCount, amount: summary.totalAmount, icon: "ri-database-2-line" },
            { key: "sudahBayar", label: "Sudah Bayar", color: "green", count: summary.sudahBayarCount, amount: summary.sudahBayarAmount, icon: "ri-check-double-line" },
            { key: "belumBayar", label: "Belum Bayar", color: "red", count: summary.belumBayarCount, amount: summary.belumBayarAmount, icon: "ri-close-circle-line" },
          ].map((item) => (
            <div key={item.key} className={`bg-white border-t-4 border-${item.color}-600 rounded-xl shadow-lg p-5 flex items-center gap-4`}>
              <div className={`p-4 rounded-full bg-${item.color}-100`}>
                <i className={`${item.icon} text-3xl text-${item.color}-600`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">{item.label}</h3>
                <p className={`text-2xl font-bold text-${item.color}-600`}>{item.count} Data</p>
                <p className={`text-lg font-semibold text-${item.color}-700`}>Rp. {item.amount.toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}
        </div>

         <h1 className="text-4xl mt-10 font-bold">Data Siswa / Guru / Karyawan</h1>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative w-full md:w-1/3">
            <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
            <input type="text" placeholder="Cari nama..." value={searchTermUser} onChange={(e) => setSearchTermUser(e.target.value)} className="p-2 pl-10 border-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-sky-400" />
          </div>

          <select className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400" value={searchCategoryUser} onChange={(e) => { setSearchCategoryUser(e.target.value); setSearchClass("Semua"); setSearchJurusan("Semua"); setSearchMapel(""); }}>
            <option value="Semua">Semua Kategori</option>
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>

          {searchCategoryUser === "Siswa" && (
            <>
              <select className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400" value={searchClass} onChange={(e) => setSearchClass(e.target.value)}>
                <option value="Semua">Semua Kelas</option>
                {classOptions.map((kelas, i) => (<option key={i} value={kelas}>{kelas}</option>))}
              </select>
              <select className="p-2 border-2 rounded-lg w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400" value={searchJurusan} onChange={(e) => setSearchJurusan(e.target.value)}>
                <option value="Semua">Semua Jurusan</option>
                {jurusanOptions.map((jur, i) => (<option key={i} value={jur}>{jur}</option>))}
              </select>
            </>
          )}

          {searchCategoryUser === "Guru" && (
            <div className="relative w-full md:w-1/3">
              <i className="ri-book-2-line absolute left-3 top-3 text-gray-400"></i>
              <input type="text" placeholder="Cari Mapel..." value={searchMapel} onChange={(e) => setSearchMapel(e.target.value)} className="p-2 pl-10 border-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-sky-400" />
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6">
          <table className="min-w-full table-auto text-gray-700">
            <thead className="bg-sky-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center w-12">No</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Kelas</th>
                <th className="py-3 px-4 text-left">Jurusan / Mapel</th>
                <th className="py-3 px-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataUser.length > 0 ? filteredDataUser.map((user, index) => (
                <tr key={user.id || index} className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100 transition`}>
                  <td className="py-3 px-4 text-center font-medium">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center gap-2">{getCategoryIcon(user.kategori)}<span>{user.kategori}</span></td>
                  <td className="py-3 px-4">{user.nama}</td>
                  <td className="py-3 px-4">{user.kelas || "-"}</td>
                  <td className="py-3 px-4">{user.kategori === "Siswa" ? user.jurusan || "-" : user.mapel || "-"}</td>
                  <td className="py-3 px-4 text-right">{user.email || "-"}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center py-5 text-gray-500 italic">Tidak terdapat data user.</td></tr>
              )}
            </tbody>
          </table>
        </div>

         <h1 className="text-4xl mt-10 font-bold">Daftar Tagihan</h1>
        <div className="flex flex-col md:flex-row gap-3 items-center my-6">
          <div className="relative w-full md:w-1/3">
            <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
            <input type="text" placeholder="Cari tagihan berdasarkan nama..." value={searchTermTagihan} onChange={(e) => setSearchTermTagihan(e.target.value)} className="p-2 pl-10 border rounded w-full bg-white focus:ring-2 focus:ring-sky-400" />
          </div>
          <select className="p-2 border rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400" value={searchStatusTagihan} onChange={(e) => setSearchStatusTagihan(e.target.value)}>
            <option value="Semua">Semua Status</option>
            {filterOptionsTagihan.map((status) => (<option key={status} value={status}>{status}</option>))}
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-10">
          <table className="table-auto w-full text-gray-700">
            <thead className="bg-sky-600 text-white text-left">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Jumlah</th>
                <th className="py-3 px-4">Jenis Tagihan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataTagihan.length > 0 ? filteredDataTagihan.map((item, index) => (
                <tr key={item.id || index} className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"} hover:bg-sky-100 transition`}>
                  <td className="py-3 text-center px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.nama || "-"}</td>
                  <td className="py-3 px-4 text-right">{item.email || "-"}</td>
                  <td className="py-3 px-4 text-right">{formatRupiah(item.jumlah)}</td>
                  <td className="py-3 px-4">{item.jenis || "-"}</td>
                  <td className={`py-3 px-4 font-semibold ${cleanStatus(item.status) === "Sudah Bayar" ? "text-green-600" : "text-red-600"}`}>{cleanStatus(item.status)}</td>
                  <td className="py-3 px-4">{formatDateUSA(item.tanggal)}</td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-5 text-gray-500 italic">Tidak terdapat data tagihan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Horw;
