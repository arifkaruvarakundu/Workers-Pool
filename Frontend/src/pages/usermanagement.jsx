import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBlockUnblock = async () => {
    try {
      if (selectedUser) {
        const response = await axios.put(`http://127.0.0.1:8000/user/${selectedUser.id}/block_unblock/`);
        // Handle the response here, e.g., show a success message or update the user status.
        console.log(response);
        console.log('User blocked/unblocked successfully');
        // Refresh the user list after blocking/unblocking
        fetchUsers();
      } else {
        console.error('No user selected');
      }
    } catch (error) {
      console.error('Error blocking/unblocking user', error);
      // Handle errors
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users', error);
      // Handle errors
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 text-left">User ID</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Username</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Profile Image</th>
            <th className="py-2 px-4 bg-gray-200 text-left">User Role</th>
            <th className="py-2 px-4 bg-gray-200 text-center">Block/Unblock</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4">{user.id}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.profile_img}</td>
              <td className="py-2 px-4">{user.role}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    handleBlockUnblock();
                  }}
                  className={`px-3 py-1 rounded ${
                    user.is_active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {user.is_active ? 'Block' : 'Unblock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
