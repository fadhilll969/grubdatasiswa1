import Swal from 'sweetalert2';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";




function Dasbor() {
    const nav = useNavigate();
    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Yakin ingin logout?",
            text: "Kamu akan kembali ke halaman login.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal",
            confirmButtonColor: "#1e3a8a",
            cancelButtonColor: "#dc2626",
        }).then((r) => {
            if (r.isConfirmed) {
                Swal.fire({
                    title: "Berhasil Logout!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setTimeout(() => nav("/f"), 1500);
            }
        });
    };
    const location = useLocation();

    return (
        <div className="w-60 min-h-screen">
            <div className="fixed top-1 h-full w-60 bg-indigo-800 text-white">
                <div className="text-4xl mt-5 font-bold mb-8 text-center">MENU</div>
                <nav className="mt-15">
                    <div className="text-2xl">
                        <a
                            href="/w"
                            className={`block py-2 px-3 font-bold rounded mt-2 hover:bg-blue-600 
                                ${location.pathname === "/w" ? "bg-blue-700 font-bold" : ""
                                }`}
                        >
                            Dashboard
                        </a>

                        <a
                            href="/h"
                            className={`block py-2 font-bold px-3 rounded mt-10 hover:bg-blue-600 
                                ${location.pathname === "/h" ? "bg-blue-700 font-bold" : ""
                                }`}
                        >
                            Tabel
                        </a>

                        <div
                            onClick={handleLogout}
                            className="block font-bold bg-red-500 py-2 mt-75 px-3 rounded hover:bg-red-600"
                        >
                            Logout
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Dasbor;
