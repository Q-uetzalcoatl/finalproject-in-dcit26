import React, { useState } from 'react';

function Login({ onLogin }) {
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (password === 'admin123') {
        onLogin({ role: 'admin', name: 'Instructor' });
      } else {
        setError('Invalid Admin Password');
      }
    } else {
      // Mock Student Login - accepts any ID for demo
      if (id.trim().length > 0) {
        onLogin({ role: 'student', id: id, name: `Student ${id}` });
      } else {
        setError('Please enter your Student ID');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          DCIT 26 Final Exam
        </h1>

        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole('admin')}
          >
            Instructor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'student' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter ID (e.g., 2023-01)"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            {role === 'student' ? 'Start Exam' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;          <button
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-medium transition-all ${role === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setRole('admin')}
          >
            Instructor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'student' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter ID (e.g., 2023-01)"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            {role === 'student' ? 'Start Exam' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
