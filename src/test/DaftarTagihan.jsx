import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dasbor from "./Dasbor";
import axios from "axios";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

const DaftarTagihan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const filterOptions = ["Sudah Bayar", "Belum Bayar"];
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("Semua");


    const [summary, setSummary] = useState({
        totalCount: 0,
        totalAmount: 0,
        sudahBayarCount: 0,
        sudahBayarAmount: 0,
        belumBayarCount: 0,
        belumBayarAmount: 0,
    });


    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/coco");
            const hasil = response.data;

            setData(hasil);


            const sudahBayar = hasil.filter((i) => i.status === "Sudah Bayar");
            const belumBayar = hasil.filter((i) => i.status === "Belum Bayar");

            const totalAmount = hasil.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
            const sudahBayarAmount = sudahBayar.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
            const belumBayarAmount = belumBayar.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);

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
        fetchData();
    }, []);


    const filteredData = data.filter((item) => {
        const matchName = item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
            searchCategory === "Semua" || item.status === searchCategory;
        return matchName && matchCategory;
    });


    const formatRupiah = (num) =>
        "Rp " + Number(num || 0).toLocaleString("id-ID");

    return (
        <div className="min-h-screen bg-sky-200">
            <div className="flex">
                <Dasbor />
                <div className="flex-1 p-6">



                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">

                        <div className="bg-white border-t-4 border-sky-600 rounded-lg shadow-md p-6 text-center">
                            <i className="ri-database-2-line text-3xl text-sky-600"></i>
                            <h3 className="text-xl font-semibold mt-2 text-gray-700">
                                Total Tagihan
                            </h3>
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

                    <div className="rounded-xl mt-10 overflow-hidden">
                        <div className="p-5 flex flex-col md:flex-row gap-4">
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
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center mt-6 text-gray-700">
                            Memuat data tagihan...
                        </p>
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
                                                    {formatRupiah(item.jumlah)}
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
                                                <td className="py-3 px-4 text-center">
                                                    {item.tanggal || "-"}
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

export default DaftarTagihan;
