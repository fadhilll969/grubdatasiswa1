import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/api";

const Presensi = () => {
  const [dataOrang, setDataOrang] = useState([]);
  const [dataPresensi, setDataPresensi] = useState([]);
  const [nis, setNis] = useState("");
  const [orangDitemukan, setOrangDitemukan] = useState(null);
  const [pilihan, setPilihan] = useState("");  
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const API_MASTERDATA = `${BASE_URL}/masterdata`;
  const API_PRESENSI = `${BASE_URL}/presensi`;
  const tanggalHariIni = new Date().toISOString().split("T")[0];

  // mengatur jam
  const JAM_PRESENSI = {
    masukMulai: "06:00",
    masukSelesai: "13:00",
    pulangMulai: "15:00",  
  };

  const getJamNowHHMM = () => {
    const d = new Date();
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const isBetween = (now, start, end) => now >= start && now <= end;

   useEffect(() => {
    axios.get(API_MASTERDATA).then((res) => {
      setDataOrang(
        res.data.map((s) => ({
          nis: String(s.nomor),
          nama: s.nama,
          kategori: s.kategori?.kategori_nama,  
        }))
      );
    });
  }, []);

  const fetchPresensi = async () => {
    const res = await axios.get(API_PRESENSI);
    setDataPresensi(res.data);
  };

  useEffect(() => {
    fetchPresensi();
  }, []);

  const getPresensiHariIni = (orang) =>
    dataPresensi.find(
      (d) => d.nis === orang.nis && d.tanggal === tanggalHariIni
    );

  const reset = () => {
    setNis("");
    setOrangDitemukan(null);
    setKeteranganIzin("");
    setIsProcessing(false);
  };

   const prosesHadir = async (orang) => {
    const now = getJamNowHHMM();
    const presensi = getPresensiHariIni(orang);

     if (presensi?.kehadiran === "IZIN") {
      return Swal.fire(
        "Sudah izin",
        "Hari ini Anda sudah izin dan tidak bisa hadir",
        "info"
      );
    }

  
    if (!presensi) {
      if (
        !isBetween(
          now,
          JAM_PRESENSI.masukMulai,
          JAM_PRESENSI.masukSelesai
        )
      ) {
        return Swal.fire(
          "Di luar jam masuk",
          `Masuk hanya ${JAM_PRESENSI.masukMulai} - ${JAM_PRESENSI.masukSelesai}`,
          "warning"
        );
      }

      await axios.post(API_PRESENSI, {
        nis: orang.nis,
        nama: orang.nama,
        tanggal: tanggalHariIni,
        jamMasuk: now,
        jamPulang: "",
        kehadiran: "HADIR",
        keterangan: "",
      });

      return Swal.fire({
        icon: "success",
        title: orang.nama,
        text: "Absen masuk berhasil",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        fetchPresensi();
        reset();
      });
    }

     
    if (!presensi.jamPulang) {
      if (now < JAM_PRESENSI.pulangMulai) {
        return Swal.fire(
          "Belum waktunya pulang",
          `Pulang setelah jam ${JAM_PRESENSI.pulangMulai}`,
          "warning"
        );
      }

      await axios.put(`${API_PRESENSI}/${presensi.id}`, {
        ...presensi,
        jamPulang: now,
      });

      return Swal.fire({
        icon: "success",
        title: orang.nama,
        text: "Absen pulang berhasil",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        fetchPresensi();
        reset();
      });
    }

     Swal.fire(
      "Presensi lengkap",
      "Anda sudah absen masuk & pulang hari ini",
      "info"
    );
    reset();
  };

   const prosesIzin = async (orang) => {
    if (!keteranganIzin.trim()) {
      setIsProcessing(false);
      return Swal.fire("Isi keterangan izin dulu", "", "warning");
    }

    const presensi = getPresensiHariIni(orang);
    if (presensi) {
      return Swal.fire(
        "Tidak bisa izin",
        "Anda sudah melakukan presensi hari ini",
        "warning"
      );
    }

    await axios.post(API_PRESENSI, {
      nis: orang.nis,
      nama: orang.nama,
      tanggal: tanggalHariIni,
      jamMasuk: "",
      jamPulang: "",
      kehadiran: "IZIN",
      keterangan: keteranganIzin,
    });

    Swal.fire({
      icon: "success",
      title: orang.nama,
      text: "Izin berhasil",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      fetchPresensi();
      reset();
    });
  };

  // ===== AUTO SUBMIT (TANPA ENTER) =====
  const handleNisChange = async (e) => {
    const v = e.target.value.trim();
    setNis(v);

    if (!v || isProcessing) return;

    const orang = dataOrang.find((o) => o.nis === v);
    if (!orang) return;

    if (!pilihan) {
      return Swal.fire("Pilih HADIR / IZIN dulu", "", "warning");
    }

    const presensi = getPresensiHariIni(orang);

     if (presensi?.kehadiran === "IZIN") {
      return Swal.fire(
        "Sudah izin",
        "Hari ini Anda sudah izin",
        "info"
      );
    }
    if (
      presensi?.kehadiran === "HADIR" &&
      presensi.jamMasuk &&
      presensi.jamPulang
    ) {
      return Swal.fire(
        "Selesai",
        "Anda sudah absen masuk & pulang",
        "info"
      );
    }

    setIsProcessing(true);
    setOrangDitemukan(orang);

    if (pilihan === "HADIR") await prosesHadir(orang);
   };

  return (
    <div className="min-h-screen bg-sky-200 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center">Presensi</h1>

       
        <div className="flex gap-3 justify-center mt-4">
          {["HADIR", "IZIN"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPilihan(p);
                reset();
              }}
              className={`px-4 py-2 rounded-lg text-white font-bold ${
                p === "HADIR" ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

       
        {pilihan && (
          <input
            className="w-full border p-3 rounded-lg mt-4"
            placeholder={`Scan / Masukkan Nomor (${pilihan})`}
            value={nis}
            onChange={handleNisChange}
            autoFocus
          />
        )}

        {orangDitemukan && (
          <div className="mt-3 bg-gray-100 p-3 rounded text-center">
            <b>{orangDitemukan.nama}</b>
            <p>{orangDitemukan.kategori}</p>
          </div>
        )}

        {pilihan === "IZIN" && orangDitemukan && (
          <>
            <textarea
              className="w-full mt-3 border p-3 rounded"
              placeholder="Keterangan izin"
              value={keteranganIzin}
              onChange={(e) => setKeteranganIzin(e.target.value)}
            />
            <button
              className="w-full mt-3 bg-yellow-500 text-white font-bold py-2 rounded"
              onClick={() => prosesIzin(orangDitemukan)}
            >
              Kirim Izin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Presensi;
