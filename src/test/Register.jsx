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
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);  

        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ ...formData, id: Date.now() });
        localStorage.setItem("users", JSON.stringify(users));

        Swal.fire({
            icon: "success",
            title: "Berhasil daftar!",
            text: "Akun kamu berhasil dibuat.",
            confirmButtonText: "Oke",
        }).then(() => {
            setLoading(false);  
            navigate("/f");
        });

        setFormData({ name: "", email: "", password: "" });
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-600 bg-indigo-400">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md h-120 w-100 max-w-md"
            >
                <h2 className="text-center text-3xl font-bold mb-6">Register</h2>

                <label className="block mb-1 mt-10 font-medium">Nama</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan Nama"
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan Email"
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <label className="block mb-1 font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan Password"
                    className="w-full p-2 mb-6 border rounded"
                    required
                />
                <div className="flex justify-center mt-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Mengirim..." : "Daftar"}

                    </button>
                </div>
                <div className="flex justify-center">

                    <div className="flex justify-between mt-4">
                        <h1 className="">
                            Sudah Punya Akun?
                            <button >
                                <span className="font-bold ml-1 text-sky-400 underline">
                                    <Link to="/f">
                                        Login
                                    </Link>
                                </span>
                            </button>
                        </h1>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register;
