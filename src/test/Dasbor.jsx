 import "remixicon/fonts/remixicon.css";  
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Dasbor() {
  const nav = useNavigate();
  const location = useLocation();

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

  const menuItems = [
    { path: "/w", icon: "ri-dashboard-line", label: "Dashboard" },
    { isSection: true, label: "Database" },
    { path: "/datakategori", icon: "ri-folder-2-line", label: "Kategori Data" },
    { path: "/kelas", icon: "ri-team-line", label: "Kelas" },
    { path: "/h", icon: "ri-database-2-line", label: "Master Data" },
    { isSection: true, label: "Keuangan" },
    { path: "/a", icon: "ri-price-tag-3-line", label: "Kategori Tagihan" },
    { path: "/o", icon: "ri-bill-line", label: "Tagihan" },
    { path: "/q", icon: "ri-file-list-3-line", label: "Rekap Tagihan" },
  ];

  return (
    <div className="w-60 min-h-screen">
      <div className="fixed top-0 left-0 h-full w-60 bg-indigo-800 text-white shadow-lg">
        <div className="text-3xl mt-4 font-bold mb-8 text-center flex items-center justify-center gap-2">
          <i className="ri-menu-2-line"></i> MENU
        </div>

        <nav className="px-3">
          <div className="text-lg">
            {menuItems.map((item, index) =>
              item.isSection ? (
                <p
                  key={index}
                  className="mt-5 mb-2 text-sm uppercase tracking-wide text-indigo-300 font-semibold"
                >
                  {item.label}
                </p>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200
                    hover:bg-blue-600 hover:translate-x-1
                    ${location.pathname === item.path ? "bg-blue-700 font-bold" : ""}`}
                >
                  <i className={item.icon}></i>
                  {item.label}
                </Link>
              )
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-2 py-2 px-3 mt-10 rounded-md bg-red-500 hover:bg-red-600 font-bold transition-all duration-200"
            >
              <i className="ri-logout-box-line"></i> Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Dasbor;
