import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configFirebase"; // Import auth dari firebase-config
import { Link } from "react-router-dom";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan kesalahan
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Auth = (e) => {
    e.preventDefault();

    // Firebase Authentication: sign in with email and password
    signInWithEmailAndPassword(auth, Username, Password)
      .then((userCredential) => {
        // Login berhasil
        const user = userCredential.user;
        console.log("User logged in:", user);
        setErrorMessage(""); // Reset pesan kesalahan jika login berhasil
        navigate("/dasbor"); // Navigasi ke dashboard setelah login sukses
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Login failed:", errorMessage);

        // Set pesan kesalahan untuk ditampilkan
        if (errorMessage.includes("user-not-found")) {
          setErrorMessage("Pengguna tidak ditemukan.");
        } else if (errorMessage.includes("wrong-password")) {
          setErrorMessage("Kata sandi salah.");
        } else if (errorMessage.includes("invalid-email")) {
          setErrorMessage("Email tidak valid.");
        } else {
          setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
        }
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-[#FFF176] rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
          <div className="self-center text-xl font-medium text-gray-600 sm:text-2xl">
            BPR Connect
          </div>
          <div className="mt-10">
            <form onSubmit={Auth}>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="py-2 rounded-[3px] px-2 border-gray-300 border w-full"
                    placeholder="Nama Pengguna"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2 rounded-[3px] px-2 border-gray-300 border w-full"
                    placeholder="Kata Sandi"
                  />
                </div>
              </div>
              {errorMessage && ( // Tampilkan pesan kesalahan jika ada
                <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
              )}
              <p className="text-md text-gray-500">
                Lupa kata sandi?{" "}
                <Link
                  className="text-gray-500 hover:text-blue-500"
                  to={"/lupa-sandi"}
                >
                  Lupa sandi
                </Link>
              </p>
              <div className="flex w-full">
                <button
                  type="submit"
                  className="bg-blue-400 py-2 px-4 rounded-md mb-3"
                >
                  Masuk
                </button>
              </div>
            </form>
            <p className="text-md text-gray-500">
              Belum memiliki akun?{" "}
              <Link
                className="text-gray-500 hover:text-blue-500"
                to={"/daftar"}
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
