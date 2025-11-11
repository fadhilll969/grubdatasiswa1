import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dasbor from "./Dasbor";

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
                const data = {
                    ...res.data,
                    aktif: res.data.aktif !== undefined ? res.data.aktif : false,
                };
                setKategori(data);
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data kategori:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Data kategori tidak ditemukan",
                });
                navigate("/a");

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
            navigate("/a");
        } catch (error) {
            console.error("Gagal memperbarui kategori:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan data",
            });
        }
    };


    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-sky-200 flex">
            <Dasbor />
            <div className="flex-1 p-6">
                <div className="bg-white h-115 w-200 ml-27 mt-10 rounded-xl shadow-lg overflow-hidden">

                    <div className="bg-sky-600 py-4 px-6 flex items-center justify-center gap-2">
                        <i className="ri-edit-2-line text-white text-2xl"></i>
                        <h3 className="text-2xl font-semibold text-white">Edit Kategori</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Nama Kategori</label>
                            <input
                                type="text"
                                name="nama_kategori"
                                value={kategori.nama_kategori}
                                onChange={handleChange}
                                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                                placeholder="Masukkan Nama Kategori"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Keterangan</label>
                            <textarea
                                name="keterangan"
                                value={kategori.keterangan}
                                onChange={handleChange}
                                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-sky-400"
                                rows="3"
                                placeholder="Masukkan Keterangan"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition duration-200 flex items-center justify-center gap-2"
                        >
                            <i className="ri-save-3-line"></i> Simpan
                        </button>

                        <button
                            type="button"
                            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2"
                            onClick={() => navigate("/a")}
                        >
                            <i className="ri-arrow-left-line"></i> Batal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editkategori;
