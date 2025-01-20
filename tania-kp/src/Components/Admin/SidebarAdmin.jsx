import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { signOut, onAuthStateChanged, updatePassword } from "firebase/auth";
import { auth, db } from "../../configFirebase";
import { doc, getDoc } from "firebase/firestore";

const SidebarAdmin = ({ tutupSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState(""); // New state to store the user's name
  
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/deposito")) {
      setOpenDropdown("deposito");
    } else if (path.startsWith("/kredit")) {
      setOpenDropdown("kredit");
    } else {
      setOpenDropdown(null);
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role and name from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
          setUserName(userDoc.data().name); // Set the user's name
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prevDropdown) =>
      prevDropdown === dropdownName ? null : dropdownName
    );
  };

  const closeSidebar = () => {
    tutupSidebar(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const handlePasswordReset = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok");
      return;
    }

    try {
      if (user) {
        await updatePassword(user, newPassword);
        alert("Kata sandi berhasil diperbarui");
        setShowModal(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
      setError("Gagal memperbarui kata sandi. Pastikan Anda login kembali.");
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `block p-3 pl-10 ${isActive ? "bg-[#81B5FA]" : "hover:bg-gray-200"}`;

  return (
    <>
    <aside className="mt-0 sm:mt-7 w-[300px] fixed bg-white drop-shadow-xl overflow-y-scroll h-[100%] sm:h-[90%]">
      <div className="mb-4 px-2 sm:p-4 bg-gray-50 drop-shadow-xl">
        <div className="flex justify-between px-2">
          <button onClick={closeSidebar} className="sm:hidden block">
            <FaTimes size={21} />
          </button>
          <div className="mr-2">
            {user && (
              <div className="text-end sm:text-left">
                <h1 className="text-xl font-bold">{userName}</h1>{" "}
                {/* Display user's name */}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold pl-4 mb-0">Menu</h1>
        <nav>
          <NavLink to="/dasbor" className={getNavLinkClass}>
            Beranda
          </NavLink>

          {/* Deposito */}
          <div className="relative">
            <button
              className="flex items-center justify-between w-full p-3 pl-10 hover:bg-gray-200"
              onClick={() => toggleDropdown("deposito")}
            >
              <span>Deposito</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  openDropdown === "deposito" ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {openDropdown === "deposito" && (
              <div className="pl-6 transition-all duration-500 ease-out">
                <NavLink to="/deposito/simulasi" className={getNavLinkClass}>
                  Simulasi Deposito
                </NavLink>
                {userRole === "user" && (
                  <NavLink
                    to="/form-daftar-deposito-nasabah"
                    className={getNavLinkClass}
                  >
                    Daftar Deposito
                  </NavLink>
                )}

                {userRole === "admin" && (
                  <NavLink
                    to="/form-daftar-deposito"
                    className={getNavLinkClass}
                  >
                    Daftar Deposito
                  </NavLink>
                )}

                <NavLink to="/tabel-deposito" className={getNavLinkClass}>
                  Tabel Deposito
                </NavLink>
              </div>
            )}
          </div>

          {/* Kredit */}
          <div className="relative">
            <button
              className="flex items-center justify-between w-full p-3 pl-10 hover:bg-gray-200"
              onClick={() => toggleDropdown("kredit")}
            >
              <span>Kredit</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  openDropdown === "kredit" ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {openDropdown === "kredit" && (
              <div className="pl-6 transition-all duration-500 ease-out">
                <NavLink to="/kredit/simulasi" className={getNavLinkClass}>
                  Simulasi Kredit
                </NavLink>
                {userRole === "admin" && (
                  <NavLink
                    to="/admin-daftar-kredit"
                    className={getNavLinkClass}
                  >
                    Daftar Kredit
                  </NavLink>
                )}
                {userRole === "user" && (
                  <NavLink
                    to="/nasabah-daftar-kredit"
                    className={getNavLinkClass}
                  >
                    Daftar Kredit
                  </NavLink>
                )}

                {userRole === "admin" && (
                  <NavLink to="/ajukan-rek" className={getNavLinkClass}>
                    Ajukan Restrukturisasi
                  </NavLink>
                )}
                {userRole === "user" && (
                  <NavLink to="/ajukan-rek-nasabah" className={getNavLinkClass}>
                    Ajukan Restrukturisasi
                  </NavLink>
                )}
                {userRole === "admin" && (
                  <NavLink to="/ajukan-topup" className={getNavLinkClass}>
                    Ajukan Top-Up
                  </NavLink>
                )}
                {userRole === "user" && (
                  <NavLink
                    to="/ajukan-topup-nasabah"
                    className={getNavLinkClass}
                  >
                    Ajukan Top-Up
                  </NavLink>
                )}
                <NavLink to="/tabel-kredit" className={getNavLinkClass}>
                  Tabel Kredit
                </NavLink>
              </div>
            )}
          </div>

          {userRole === "admin" && (
            <NavLink to="/pengaduan" className={getNavLinkClass}>
              Pengaduan
            </NavLink>
          )}
          {userRole === "user" && (
            <NavLink to="/pengaduan-nasabah" className={getNavLinkClass}>
              Pengaduan
            </NavLink>
          )}
          {userRole === "user" && (
            <NavLink to="/kontak-ao" className={getNavLinkClass}>
              Kontak AO
            </NavLink>
          )}
          {userRole === "admin" && (
            <NavLink to="/kontak-ao-admin" className={getNavLinkClass}>
              Kontak AO
            </NavLink>
          )}
          <button className={`flex pl-4 pb-5 w-full`} onClick={() => setShowModal(true)}>
            Ubah Kata Sandi
          </button>

          <button className="flex pl-4 pb-5 w-full" onClick={logout}>
            Keluar
          </button>
        </nav>
      </div>
    </aside>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Ubah Kata Sandi</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <input
              type="password"
              placeholder="Kata sandi baru"
              className="w-full p-2 mb-4 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Konfirmasi kata sandi"
              className="w-full p-2 mb-4 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePasswordReset}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAdmin;
