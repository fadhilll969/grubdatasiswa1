import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import "remixicon/fonts/remixicon.css";

function Horw() {
    const nav = useNavigate();

    const [jumlah, setJumlah] = useState({
        total: 0,
        siswa: 0,
        guru: 0,
        karyawan: 0,
    });

    const [dataList, setDataList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("Semua");
    const [searchClass, setSearchClass] = useState("Semua");
    const [classOptions, setClassOptions] = useState([]);

    const filterOptions = ["Siswa", "Guru", "Karyawan"];

    useEffect(() => {
        const ambilData = async () => {
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

                 const kelasUnik = [...new Set(siswa.map((s) => s.kelas))];
                setClassOptions(kelasUnik);
            } catch (error) {
                console.log("Gagal ambil data dari db.json", error);
            }
        };

        ambilData();
    }, []);

    const filteredData = dataList.filter((data) => {
        const matchName = data.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = searchCategory === "Semua" || data.kategori === searchCategory;
        const matchClass = searchClass === "Semua" || data.kelas === searchClass;
        return matchName && matchCategory && matchClass;
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
                    <div className="bg-white border-t-4 border-sky-600 text-gray-800 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-database-2-line text-3xl text-sky-600"></i>
                        <h3 className="text-xl font-semibold mt-2">Total</h3>
                        <p className="text-3xl font-bold my-3">{jumlah.total}</p>
                    </div>

                    <div className="bg-white border-t-4 border-blue-500 text-gray-800 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-graduation-cap-line text-3xl text-blue-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Siswa</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.siswa}</p>
                    </div>

                    <div className="bg-white border-t-4 border-green-500 text-gray-800 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-book-2-line text-3xl text-green-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Guru</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.guru}</p>
                    </div>

                    <div className="bg-white border-t-4 border-yellow-500 text-gray-800 rounded-lg shadow-md p-6 text-center">
                        <i className="ri-briefcase-3-line text-3xl text-yellow-500"></i>
                        <h3 className="text-xl font-semibold mt-2">Karyawan</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.karyawan}</p>
                    </div>
                </div>

                 <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
                    <div className="relative w-full md:w-1/3">
                        <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 pl-10 border rounded w-full bg-white focus:ring-2 focus:ring-sky-400"
                        />
                    </div>

                     <select
                        className="p-2 border rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400"
                        value={searchCategory}
                        onChange={(e) => {
                            const selectedCategory = e.target.value;
                            setSearchCategory(selectedCategory);

                             if (selectedCategory !== "Siswa") {
                                setSearchClass("Semua");
                            }
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
                        <select
                            className="p-2 border rounded w-full md:w-1/4 bg-white focus:ring-2 focus:ring-sky-400"
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
                    )}
                </div>

              
                <div className="mt-6 overflow-x-auto rounded-lg shadow-inner">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-sky-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-center">No</th>
                                <th className="py-3 px-4 text-center">Kategori</th>
                                <th className="py-3 px-4 text-center">Nama</th>
                                <th className="py-3 px-4 text-center">Kelas</th>
                                <th className="py-3 px-4 text-center">Nomer</th>
                                <th className="py-3 px-4 text-center">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((data, index) => (
                                    <tr
                                        key={data.id}
                                        className={`${
                                            index % 2 === 0 ? "bg-white/70" : "bg-sky-50/70"
                                        } hover:bg-sky-100/80 transition`}
                                    >
                                        <td className="py-3 text-center px-4">{index + 1}</td>
                                        <td className="py-3 px-4 flex items-center">
                                            {getCategoryIcon(data.kategori)} {data.kategori}
                                        </td>
                                        <td className="py-3 px-4">{data.nama}</td>
                                        <td className="py-3 text-center px-4">
                                            {data.kategori === "Siswa" ? data.kelas : "-"}
                                        </td>
                                        <td className="py-3 text-center px-4">{data.nomer}</td>
                                        <td className="py-3 text-right px-4">{data.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5 text-gray-500 italic bg-sky-100/60"
                                    >
                                        Tidak ada data yang cocok.
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
