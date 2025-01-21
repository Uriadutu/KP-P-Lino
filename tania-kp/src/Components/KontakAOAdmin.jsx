import React, { useState, useEffect } from "react";
import { db } from "../configFirebase"; // Import Firestore configuration
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Authentication

const KontakAO = () => {
  const [pesan, setPesan] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]); // State to store list of users
  const [showUserModal, setShowUserModal] = useState(false); // State for user selection modal
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistory(chats);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "Anonymous");
          setRole(userDoc.data().role || "user");
        }
      } else {
        setUserId(null);
        setName("");
        setRole("");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Fetch users list for the popup
    const q = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    });

    return () => unsubscribeUsers();
  }, []);

  const handleSendMessage = async () => {
    if (pesan.trim() === "" || !selectedUser) return;

    await addDoc(collection(db, "chats"), {
      message: pesan,
      from: name,
      userId: userId,
      createdAt: serverTimestamp(),
      to: selectedUser.id, // Sending message to specific user
      role: role,
    });

    setPesan("");
    setSelectedUser(null); // Reset selected user after sending message
  };

  const openUserModal = () => {
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(false); // Close user modal after selection
  };

  return (
    <div>
      <div className="kontak-ao container mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Kontak AO
        </h2>

        <div className="chat-container bg-white p-6 rounded-lg shadow-lg">
          <div className="chat-history overflow-y-auto max-h-96">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`message p-3 rounded-lg mb-2 ${
                  chat.userId === userId
                    ? "bg-blue-100 text-left"
                    : "bg-green-100 text-right"
                }`}
              >
                <strong>{chat.from}:</strong>
                <p>{chat.message}</p>
              </div>
            ))}
          </div>

          <button
            onClick={openUserModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            Kirim Pesan
          </button>

          {selectedUser && (
            <div className="mt-4">
              <h4 className="text-lg font-bold">Kirim pesan ke {selectedUser.name}</h4>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-grow border p-2 rounded-l-lg focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                >
                  Kirim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUserModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Pilih Pengguna</h3>
            <ul className="overflow-y-auto max-h-64">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectUser(user)}
                >
                  {user.name || "Unknown User"}
                </li>
              ))}
            </ul>
            <button
              onClick={closeUserModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KontakAO;
