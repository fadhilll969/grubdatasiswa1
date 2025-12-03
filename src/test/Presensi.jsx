import React, { useState, useEffect } from "react";
import Dasbor from "./Dasbor";
import axios from "axios";
import Swal from "sweetalert2";

const Presensi = () => {
  const [dataOrang, setDataOrang] = useState([]);  
  const [dataPresensi, setDataPresensi] = useState([]);  

  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jamMasuk, setJamMasuk] = useState("");
  const [jamPulang, setJamPulang] = useState("");

  const API_PRESENSI = "http://localhost:5000/presensi";
  const API_DOSS = "http://localhost:5000/doss";

   useEffect(() => {
    const fetchOrang = async () => {
      try {
        const res = await axios.get(API_DOSS);
        const semuaKategori = ["Siswa", "Guru", "Karyawan"];
        const daftarOrang = res.data
          .filter((x) => semuaKategori.includes(x.kategori))
          .map((s) => ({ nis: s.nomor, nama: s.nama, kategori: s.kategori }));
        setDataOrang(daftarOrang);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchOrang();
  }, []);

   const fetchPresensi = async () => {
    try {
      const res = await axios.get(API_PRESENSI);
      setDataPresensi(res.data);
    } catch (error) {
      console.error("Gagal mengambil data presensi:", error);
    }
  };

  useEffect(() => {
    fetchPresensi();
  }, []);

   const handleNisChange = (e) => {
    const value = e.target.value;
    setNis(value);

     const s = dataOrang.find((x) => x.nis === value);
    setNama(s ? s.nama : "");

     const presensiHariIni = dataPresensi.find(
      (d) => d.nis === value && d.tanggal === tanggal
    );
    if (presensiHariIni) {
      setJamMasuk(presensiHariIni.jamMasuk || "");
      setJamPulang(presensiHariIni.jamPulang || "");
    } else {
      setJamMasuk("");
      setJamPulang("");
    }
  };

   const tambahPresensi = async (e) => {
    e.preventDefault();

    if (!nis || !nama || !tanggal) {
      Swal.fire({
        icon: "warning",
        title: "Data tidak lengkap",
        text: "Nomor Unik dan Tanggal wajib diisi!",
      });
      return;
    }

    const presensiHariIni = dataPresensi.find(
      (d) => d.nis === nis && d.tanggal === tanggal
    );

    try {
      if (presensiHariIni) {
         if (!jamPulang) {
          Swal.fire({
            icon: "warning",
            title: "Isi Jam Pulang",
            text: "Masukkan jam pulang untuk update presensi!",
          });
          return;
        }

        await axios.put(`${API_PRESENSI}/${presensiHariIni.id}`, {
          ...presensiHariIni,
          jamPulang,
        });

        Swal.fire({
          icon: "success",
          title: "Presensi pulang berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
         if (!jamMasuk) {
          Swal.fire({
            icon: "warning",
            title: "Isi Jam Masuk",
            text: "Masukkan jam masuk untuk presensi!",
          });
          return;
        }

        await axios.post(API_PRESENSI, {
          nis,
          nama,
          tanggal,
          jamMasuk,
          jamPulang: "",
        });

        Swal.fire({
          icon: "success",
          title: "Presensi masuk berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      fetchPresensi();
      setNis("");
      setNama("");
      setJamMasuk("");
      setJamPulang("");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan presensi",
      });
    }
  };

  const formatTanggal = (tgl) => {
    const [year, month, day] = tgl.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-sky-100 flex">
      <Dasbor />
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-xl mb-10 max-w-3xl mx-auto">
          <form
            onSubmit={tambahPresensi}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="font-medium text-gray-700 mb-1 block">Nomor Unik</label>
              <input
                type="text"
                value={nis}
                onChange={handleNisChange}
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
                placeholder="Masukkan nomor unik"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-1 block">Nama</label>
              <input
                type="text"
                value={nama}
                readOnly
                className="w-full mt-1 border bg-gray-100 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-1 block">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {!dataPresensi.find((d) => d.nis === nis && d.tanggal === tanggal) ? (
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Jam Masuk</label>
                <input
                  type="time"
                  value={jamMasuk}
                  onChange={(e) => setJamMasuk(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
                />
              </div>
            ) : (
              <div>
                <label className="font-medium text-gray-700 mb-1 block">Jam Pulang</label>
                <input
                  type="time"
                  value={jamPulang}
                  onChange={(e) => setJamPulang(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
                />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Simpan Presensi
              </button>
            </div>
          </form>
        </div>

         <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Daftar Presensi</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-sky-600 text-left text-white">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2">Nomor Unik</th>
                  <th className="px-4 py-2">Jam Masuk</th>
                  <th className="px-4 py-2">Jam Pulang</th>
                  <th className="px-4 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {dataPresensi.map((item, i) => {
                  const orang = dataOrang.find((o) => o.nis === item.nis);
                  return (
                    <tr key={i} className="hover:bg-sky-100">
                      <td className="px-4 py-2 text-center">{i + 1}</td>
                      <td className="px-4 py-2">{item.nama}</td>
                      <td className="px-4 py-2">{orang ? orang.kategori : "-"}</td>
                      <td className="px-4 py-2">{item.nis}</td>
                      <td className="px-4 py-2">{item.jamMasuk}</td>
                      <td className="px-4 py-2">{item.jamPulang}</td>
                      <td className="px-4 py-2 text-right">{formatTanggal(item.tanggal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presensi;
