import Swal from 'sweetalert2';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

    return (
        <div className="w-60 min-h-screen">
            <div className="fixed top-1 h-full w-60 bg-indigo-600 text-white">
                <div className="text-4xl font-bold mb-8 text-center">MENU</div>
                <nav className="mt-15">
                    <div className="text-2xl text-center">
                        <a href="/w" className="block py-2 px-3 rounded hover:bg-blue-600">Dashboard</a>
                        <a href="/h" className="block py-2 px-3 mt-10 rounded hover:bg-blue-600">Tabel</a>
                        <a href="/" onClick={handleLogout} className="block py-2 mt-80 px-3 rounded hover:bg-blue-600">Logout</a>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Dasbor;
