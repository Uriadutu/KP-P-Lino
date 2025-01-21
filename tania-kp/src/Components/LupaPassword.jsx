import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const LupaPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    try {
      const auth = getAuth();
      // Kirim email reset password
      await sendPasswordResetEmail(auth, email);
      setSuccess("Tautan reset kata sandi telah dikirim ke email Anda.");
      setEmail(""); // Reset email setelah sukses
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError("Terjadi kesalahan. Pastikan email yang Anda masukkan benar.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-[#FFF176] rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
        <div className="self-center text-xl font-medium text-gray-600 sm:text-2xl">
          Lupa Kata Sandi
        </div>
        <div className="mt-10">
          <form onSubmit={handlePasswordReset}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="flex flex-col mb-6">
              <label htmlFor="email" className="mb-2 text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md w-full"
                placeholder="Masukkan email pengguna"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-400 py-2 px-4 rounded-md text-white"
              >
                Kirim Tautan Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
