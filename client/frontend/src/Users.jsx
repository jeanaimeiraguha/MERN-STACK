import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Users = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [editId, setEditId] = useState(null);

  const API = axios.create({ baseURL: 'http://localhost:3000' });

  useEffect(() => {
    fetchUsers();
    AOS.init({ duration: 1000 });
  }, []);

  const fetchUsers = () => {
    API.get('/user')
      .then(res => setStudents(res.data))
      .catch(err => console.error('Error fetching users:', err.message));
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const request = editId
      ? API.put(`/user/${editId}`, formData)
      : API.post('/user/addNew', formData);

    request
      .then(() => {
        fetchUsers();
        resetForm();
      })
      .catch(err => console.error('Submit error:', err.message));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', age: '' });
    setEditId(null);
  };

  const handleEdit = user => {
    setFormData({ name: user.name, email: user.email, age: user.age });
    setEditId(user._id);
  };

  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    API.delete(`/user/${id}`)
      .then(() => fetchUsers())
      .catch(err => console.error('Delete error:', err.message));
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <span className="navbar-brand fs-4 fw-bold d-flex align-items-center">
            <i className="bi bi-braces fs-3 me-2 text-info"></i>
            MERN Stack User Management System
          </span>
        </div>
      </nav>

      <div className="container">
        {/* Form Card */}
        <div className="card shadow-lg mb-4 border-0" data-aos="zoom-in">
          <div className="card-body">
            <h4 className="text-primary mb-3">
              {editId ? 'Update User Details' : 'Add New User'}
            </h4>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="name"
                  className="form-control border-primary shadow-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  name="email"
                  className="form-control border-primary shadow-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  name="age"
                  className="form-control border-primary shadow-sm"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button type="submit" className={`btn btn-${editId ? 'warning' : 'success'} w-100`}>
                  <i className={`bi ${editId ? 'bi-check2-circle' : 'bi-person-plus-fill'}`}></i>{' '}
                  {editId ? 'Update' : 'Add'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    <i className="bi bi-x-circle-fill"></i> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className="card shadow border-0" data-aos="fade-up">
          <div className="card-body">
            <h4 className="mb-3 text-dark">
              <i className="bi bi-list-ul text-primary me-2"></i>Registered Users
            </h4>
            {students.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((user, index) => (
                      <tr key={user._id} className="align-middle">
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.age}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user._id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
