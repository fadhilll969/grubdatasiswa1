import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "../Dasbor";
import "remixicon/fonts/remixicon.css";

const API_URL = "http://localhost:5000/kategori-data";

const Editkategori = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [kategori, setKategori] = useState({
        nama_kategori: "",
        keterangan: "",
        aktif: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const res = await axios.get(`${API_URL}/${id}`);
                setKategori({
                    nama_kategori: res.data.nama_kategori || "",
                    keterangan: res.data.keterangan || "",
                    aktif: res.data.aktif ?? false,
                });
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Data kategori tidak ditemukan",
                });
                navigate("/kategori");
            }
        };

        fetchKategori();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setKategori((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kategori.nama_kategori.trim() || !kategori.keterangan.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Semua kolom wajib diisi",
            });
            return;
        }

        try {
            await axios.put(`${API_URL}/${id}`, kategori);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Kategori berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/kategori");
        } catch (error) {
            console.error("Gagal memperbarui kategori:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan data",
            });
        }
    };

    if (loading) return <div className="p-10 text-lg">Loading...</div>;

    return (
        <div className="min-h-screen bg-sky-200 flex">
            <Dasbor />

            <div className="flex-1 p-8">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl ml-52 mt-20">
                    <h2 className="text-2xl font-bold text-center mb-6 text-sky-700">
                        Edit Kategori
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Nama Kategori
                            </label>
                            <input
                                type="text"
                                name="nama_kategori"
                                value={kategori.nama_kategori}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                                placeholder="Masukkan Nama Kategori"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Keterangan
                            </label>
                            <input
                                name="keterangan"
                                value={kategori.keterangan}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500"
                                placeholder="Masukkan keterangan kategori"
                            ></input>
                        </div>
 

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => navigate("/kategori")}
                            >
                                <i className="ri-arrow-left-line"></i> Kembali
                            </button>

                            <button
                                type="submit"
                                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
                            >
                                <i className="ri-save-3-line"></i> Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editkategori;
