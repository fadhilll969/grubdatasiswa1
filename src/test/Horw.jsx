import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";

function Horw() {
    const nav = useNavigate();

    const [jumlah, setJumlah] = useState({
        total: 0,
        siswa: 0,
        guru: 0,
        karyawan: 0,
    });

    const [dataList, setDataList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('Semua');

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
            } catch {
                console.log("Gagal ambil data dari db.json");
            }
        };

        ambilData();
    }, []);

    const filteredData = dataList.filter((data) => {
        const matchName = data.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
            searchCategory === "Semua" || data.kategori === searchCategory;
        return matchName && matchCategory;
    });

    return (
        <div className="flex flex-col md:flex-row">
            <Dasbor />

            <div className="flex-1 bg-sky-200 min-h-screen p-8 font-sans">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                    Dashboard Sekolah
                </h1>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-10">
                    <div className="bg-sky-500 text-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-2xl font-semibold">Total</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.total}</p>
                    </div>

                    <div className="bg-sky-500 text-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-2xl font-semibold">Siswa</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.siswa}</p>
                    </div>

                    <div className="bg-sky-500 text-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-2xl font-semibold">Guru</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.guru}</p>
                    </div>

                    <div className="bg-sky-500 text-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-2xl font-semibold">Karyawan</h3>
                        <p className="text-4xl font-bold my-3">{jumlah.karyawan}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-center mb-5">


                    <select
                        className="p-2 border-2 rounded w-full md:w-60 bg-white focus:ring-2 focus:ring-sky-400"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <option value="Semua">Semua Kategori</option>
                        {filterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-auto mt-10">
                    <table className="border-collapse border border-gray-400 w-full bg-white">
                        <thead>
                            <tr className="bg-sky-500">
                                <th className="border px-4 py-2">No</th>
                                <th className="border px-4 py-2">Kategori</th>
                                <th className="border px-4 py-2">Nama</th>
                                <th className="border px-4 py-2">Nomer</th>
                                <th className="border px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((data, index) => (
                                    <tr key={data.id} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{data.kategori}</td>
                                        <td className="border px-4 py-2">{data.nama}</td>
                                        <td className="text-center border px-4 py-2">{data.nomer}</td>
                                        <td className="border px-4 py-2">{data.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center p-4 text-gray-500 italic"
                                    >
                                        Tidak ada data ditemukan.
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
