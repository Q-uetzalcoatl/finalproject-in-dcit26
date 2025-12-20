import React from 'react';

function Admin({ studentsData, isScoreReleased, onReleaseScores, onResetSystem }) {
  // Calculate Stats
  const totalStudents = studentsData.length;
  const completed = studentsData.filter(s => s.status === 'completed').length;
  const averageScore = totalStudents > 0 
    ? (studentsData.reduce((acc, curr) => acc + curr.score, 0) / totalStudents).toFixed(1) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
            <p className="text-gray-500">DCIT 26 Final Exam Monitoring</p>
          </div>
          <button 
            onClick={onReleaseScores}
            className={`px-6 py-2 rounded-lg font-bold shadow-md transition-all ${
              isScoreReleased 
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isScoreReleased ? 'Scores Released' : 'Release Scores to Students'}
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-800">{completed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase">Average Score</p>
            <p className="text-3xl font-bold text-indigo-600">{averageScore}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase">System Status</p>
            <p className={`text-lg font-bold ${isScoreReleased ? 'text-green-600' : 'text-yellow-600'}`}>
              {isScoreReleased ? 'Results Public' : 'Grading in Progress'}
            </p>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-600">Student ID</th>
                  <th className="p-4 font-bold text-gray-600">Name</th>
                  <th className="p-4 font-bold text-gray-600">Status</th>
                  <th className="p-4 font-bold text-gray-600">Violations (Tabs)</th>
                  <th className="p-4 font-bold text-gray-600">Final Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentsData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No submissions yet.</td>
                  </tr>
                ) : (
                  studentsData.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{student.studentId}</td>
                      <td className="p-4 font-medium text-gray-800">{student.name}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {student.violations > 0 ? (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            ⚠️ {student.violations} Detected
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Clean</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-indigo-700 text-lg">
                        {student.score}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onResetSystem} className="text-red-500 text-sm underline hover:text-red-700">
            Reset All Data (Debug)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase">Average Score</p>
            <p className="text-3xl font-bold text-indigo-600">{averageScore}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase">System Status</p>
            <p className={`text-lg font-bold ${isScoreReleased ? 'text-green-600' : 'text-yellow-600'}`}>
              {isScoreReleased ? 'Results Public' : 'Grading in Progress'}
            </p>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-600">Student ID</th>
                  <th className="p-4 font-bold text-gray-600">Name</th>
                  <th className="p-4 font-bold text-gray-600">Status</th>
                  <th className="p-4 font-bold text-gray-600">Violations (Tabs)</th>
                  <th className="p-4 font-bold text-gray-600">Final Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentsData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No submissions yet.</td>
                  </tr>
                ) : (
                  studentsData.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{student.studentId}</td>
                      <td className="p-4 font-medium text-gray-800">{student.name}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {student.violations > 0 ? (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            ⚠️ {student.violations} Detected
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Clean</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-indigo-700 text-lg">
                        {student.score}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onResetSystem} className="text-red-500 text-sm underline hover:text-red-700">
            Reset All Data (Debug)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
