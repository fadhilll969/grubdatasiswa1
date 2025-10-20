import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ ...formData, id: Date.now() });
        localStorage.setItem("users", JSON.stringify(users));

        Swal.fire({
            icon: "success",
            title: "Berhasil daftar!",
            text: "Akun kamu berhasil dibuat.",
            confirmButtonText: "Oke",
        }).then(() => {
            navigate("/h");
        });

        setFormData({ name: "", email: "", password: "" });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-600 bg-indigo-400">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md h-120 w-90 max-w-md"
            >
                <h2 className="text-center text-xl font-bold mb-6">Daftar Akun</h2>

                <label className="block mb-1 mt-10 font-medium">Username</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <label className="block mb-1 font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="w-full p-2 mb-6 border rounded"
                    required
                />
                <div className="mt-5">

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
                    >
                        Daftar
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                        Kembali
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
