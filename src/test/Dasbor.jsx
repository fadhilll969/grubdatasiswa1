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
          timer: 1200,
          showConfirmButton: false,
        });
        setTimeout(() => nav("/login"), 1200);
      }
    });
  };

  const menuItems = [
    { path: "/w", icon: "ri-dashboard-line", label: "Dashboard" },

    { isSection: true, label: "Presensi" },
    { path: "/rekap-presensi", icon: "ri-file-list-3-line", label: "Rekap Presensi" },

    { isSection: true, label: "Database" },
    { path: "/kategoridata/data", icon: "ri-folder-2-line", label: " Data" },
    { path: "/kelas", icon: "ri-team-line", label: "Kelas" },
    { path: "/h", icon: "ri-database-2-line", label: "Master Data" },

    { isSection: true, label: "Keuangan" },
    { path: "/kategoriTagihan", icon: "ri-price-tag-3-line", label: "Kategori Tagihan" },
    { path: "/tagihan", icon: "ri-bill-line", label: "Tagihan" },
    { path: "/tagihan/rekap", icon: "ri-file-list-3-line", label: "Rekap Tagihan" },
  ];

  return (
    <div className="w-60 min-h-screen">
      <div className="fixed top-0 left-0 h-full w-60 bg-indigo-800 text-white shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="text-2xl mt-4 mb-6 font-bold text-center flex items-center justify-center gap-2">
          <i className="ri-menu-2-line"></i> MENU
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-3 text-sm">
          {menuItems.map((item, index) =>
            item.isSection ? (
              <p
                key={index}
                className="mt-4 mb-2 text-xs uppercase tracking-wide text-indigo-300 font-semibold"
              >
                {item.label}
              </p>
            ) : (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all
                  hover:bg-blue-600 hover:translate-x-1
                  ${
                    location.pathname.startsWith(item.path)
                      ? "bg-blue-700 font-semibold"
                      : ""
                  }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-red-500 hover:bg-red-600 font-bold transition"
          >
            <i className="ri-logout-box-line"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dasbor;
