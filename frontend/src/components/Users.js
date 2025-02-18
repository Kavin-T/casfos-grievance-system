import React, { useState, useEffect } from "react";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../services/userApi";
import { designationFormat } from "../utils/formatting";
import { toast } from "react-toastify";
import { designations } from "../constants/options";
import confirmAction from "../utils/confirmAction ";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    designation: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const getUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.users);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = await confirmAction(
      `Are you sure you want to ${isEditing ? "update" : "add"} the user?`
    );
    if (!isConfirmed) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      if (isEditing) {
        const response = await updateUser(formData);
        toast.success(response.message);
      } else {
        const response = await addUser(formData);
        toast.success(response.message);
      }
      await getUsers();
      closeModal();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmAction(
      "Are you sure you want to delete the user?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await deleteUser(id);
      toast.success(response.message);
      await getUsers();
    } catch (error) {
      toast.error(error);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({
        id: user._id,
        username: user.username,
        designation: user.designation,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: "",
        confirmPassword: "",
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: null,
        username: "",
        designation: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen" data-testid="user-management">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold text-green-700"
          data-testid="user-management-title"
        >
          User Management
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          data-testid="create-user-button"
        >
          Create New User
        </button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        data-testid="user-list"
      >
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded p-4 flex flex-col justify-between"
            data-testid={`user-name-${user.username}`}
          >
            <div>
              <h2 className="text-xl font-semibold text-green-700">
                {user.username}
              </h2>
              <p className="text-sm text-green-600">
                {designationFormat(user.designation)}
              </p>
              <p>{user.email}</p>
              <p>{user.phoneNumber}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => openModal(user)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                data-testid={`update-user-button`}
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                data-testid={`delete-user-button`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          data-testid="user-modal"
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2
              className="text-xl font-bold text-green-700 mb-4"
              data-testid="modal-title"
            >
              {isEditing ? "Update User" : "Create New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-designation"
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation.value} value={designation.value}>
                      {designation.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="\d{10}"
                  required
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-phone-number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEditing}
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isEditing}
                  className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-500"
                  data-testid="user-input-confirm-password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  data-testid="user-cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  data-testid="user-submit-button"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
