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

    const [searchTermTagihan, setSearchTermTagihan] = useState("");
    const [searchStatusTagihan, setSearchStatusTagihan] = useState("Semua");

    const [classOptions, setClassOptions] = useState([]);
    const filterOptionsUser = ["Siswa", "Guru", "Karyawan"];
    const filterOptionsTagihan = ["Sudah Bayar", "Belum Bayar"];

    const formatRupiah = (num) =>
        "Rp " + Number(num || 0).toLocaleString("id-ID");

    const fetchDataTagihan = async () => {
        try {
            const response = await axios.get("http://localhost:5000/coco");
            const hasil = response.data;
            setDataTagihan(hasil);

            const sudahBayar = hasil.filter((i) => i.status === "Sudah Bayar");
            const belumBayar = hasil.filter((i) => i.status === "Belum Bayar");

            const totalAmount = hasil.reduce(
                (sum, i) => sum + Number(i.jumlah || 0),
                0
            );
            const sudahBayarAmount = sudahBayar.reduce(
                (sum, i) => sum + Number(i.jumlah || 0),
                0
            );
            const belumBayarAmount = belumBayar.reduce(
                (sum, i) => sum + Number(i.jumlah || 0),
                0
            );

            setSummary({
                totalCount: hasil.length,
                totalAmount,
                sudahBayarCount: sudahBayar.length,
                sudahBayarAmount,
                belumBayarCount: belumBayar.length,
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
                const data = await res.json();

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
                setClassOptions([...new Set(siswa.map((s) => s.kelas))]);
            } catch (error) {
                console.log("Gagal ambil data dari db.json", error);
            }
        };

        ambilDataUser();
        fetchDataTagihan();
    }, []);

    const filteredDataUser = dataList.filter((data) => {
        const matchName = data.nama
            .toLowerCase()
            .includes(searchTermUser.toLowerCase());
        const matchCategory =
            searchCategoryUser === "Semua" || data.kategori === searchCategoryUser;
        const matchClass = searchClass === "Semua" || data.kelas === searchClass;
        return matchName && matchCategory && matchClass;
    });

    const filteredDataTagihan = dataTagihan.filter((item) => {
        const matchName = item.nama
            ?.toLowerCase()
            .includes(searchTermTagihan.toLowerCase());
        const matchStatus =
            searchStatusTagihan === "Semua" || item.status === searchStatusTagihan;
        return matchName && matchStatus;
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-sky-200">
            <Dasbor />

            <div className="flex-1 p-8 font-sans">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-2">
                    <i className="ri-dashboard-line text-sky-600"></i> Dashboard Sekolah
                </h1>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-10">
                    <div className="bg-white border-t-4 border-sky-600 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-database-2-line text-3xl text-sky-600"></i>
                        <h3 className="text-xl font-semibold mt-2">Total</h3>
                        <p className="text-3xl font-bold my-3">{jumlah.total}</p>
                    </div>
                    <div className="bg-white border-t-4 border-blue-500 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-graduation-cap-line text-3xl text-blue-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Siswa</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.siswa}</p>
                    </div>
                    <div className="bg-white border-t-4 border-green-500 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-book-2-line text-3xl text-green-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Guru</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.guru}</p>
                    </div>
                    <div className="bg-white border-t-4 border-yellow-500 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-briefcase-3-line text-3xl text-yellow-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Karyawan</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.karyawan}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white border-t-4 border-sky-600 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-database-2-line text-3xl text-sky-600"></i>
                        <h3 className="text-xl font-semibold mt-2 text-gray-700">Total</h3>
                        <p className="text-3xl font-bold my-1">{summary.totalCount}</p>
                        <p className="text-lg text-gray-600 font-semibold">
                            {formatRupiah(summary.totalAmount)}
                        </p>
                    </div>
                    <div className="bg-white border-t-4 border-green-500 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-check-double-line text-3xl text-green-500"></i>
                        <h3 className="text-xl font-semibold mt-2 text-gray-700">
                            Sudah Lunas
                        </h3>
                        <p className="text-3xl font-bold my-1 text-green-600">
                            {summary.sudahBayarCount}
                        </p>
                        <p className="text-lg text-green-700 font-semibold">
                            {formatRupiah(summary.sudahBayarAmount)}
                        </p>
                    </div>
                    <div className="bg-white border-t-4 border-red-500 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-close-circle-line text-3xl text-red-500"></i>
                        <h3 className="text-xl font-semibold mt-2 text-gray-700">
                            Belum Lunas
                        </h3>
                        <p className="text-3xl font-bold my-1 text-red-600">
                            {summary.belumBayarCount}
                        </p>
                        <p className="text-lg text-red-700 font-semibold">
                            {formatRupiah(summary.belumBayarAmount)}
                        </p>
                    </div>
                </div>
                <h1 className="text-4xl mt-10 font-bold">Data Siswa </h1>
                <div className="flex flex-col md:flex-row gap-3 items-center mb-6 mt-5">
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
                            if (selectedCategory !== "Siswa") setSearchClass("Semua");
                        }}
                    >
                        <option value="Semua">Semua Kategori</option>
                        {filterOptionsUser.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {searchCategoryUser === "Siswa" && (
                        <select
                            className="p-2 border rounded w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
                            value={searchClass}
                            onChange={(e) => setSearchClass(e.target.value)}
                        >
                            <option value="Semua">Semua Kelas</option>
                            {classOptions.map((cls) => (
                                <option key={cls} value={cls}>
                                    {cls}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="table-auto w-full text-gray-700">
                        <thead className="bg-sky-600 text-white text-center">
                            <tr>
                                <th className="py-3 px-4">No</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4">Nama</th>
                                <th className="py-3 px-4">Kelas</th>
                                <th className="py-3 px-4">nomer</th>
                                <th className="py-3 px-4">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataUser.length > 0 ? (
                                filteredDataUser.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"
                                            } hover:bg-sky-100 transition`}
                                    >
                                        <td className="py-3 text-center px-4">{index + 1}</td>
                                        <td className="py-3 px-4 ">
                                            {getCategoryIcon(user.kategori)}
                                            {user.kategori}
                                        </td>
                                        <td className="py-3 px-4">{user.nama}</td>
                                        <td className="py-3 px-4 text-center">{user.kelas || "-"}</td>
                                        <td className="py-3 px-4 text-center">{user.nomer}</td>
                                        <td className="py-3 px-4 text-right">{user.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-gray-500 italic">
                                        Tidak terdapat data user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <h1 className="text-4xl mt-10 font-bold">Daftar Tagihan</h1>
                <div className="flex flex-col rounded md:flex-row gap-3 items-center my-6">
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
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                 <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-10">
                    <table className="table-auto w-full text-gray-700">
                        <thead className="bg-sky-600 text-white text-center">
                            <tr>
                                <th className="py-3 px-4 ">No</th>
                                <th className="py-3 px-4">Nama</th>
                                <th className="py-3 px-4  ">Jumlah</th>
                                <th className="py-3 px-4 ">Jenis Tagihan</th>
                                <th className="py-3 px-4 ">Status</th>
                                <th className="py-3 px-4 ">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataTagihan.length > 0 ? (
                                filteredDataTagihan.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-sky-50"
                                            } hover:bg-sky-100 transition`}
                                    >
                                        <td className="py-3 text-center px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{item.nama}</td>
                                        <td className="py-3 px-4 text-right">{formatRupiah(item.jumlah)}</td>
                                        <td className="py-3 px-4 text-center">{item.jenisTagihan}</td>
                                        <td
                                            className={`py-3 px-4 text-center font-semibold ${item.status === "Sudah Bayar" ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {item.status || "Belum Bayar"}
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.tanggal || "-"}</td>
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
