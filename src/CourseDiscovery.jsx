import { useState } from "react";

export default function CourseDiscovery({ onClose }) {
  const [search, setSearch] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[700px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-6" style={{ scrollbarGutter: 'stable' }}>
        
        {/* Header */}
        <div className="flex justify-between mb-4 text-left">
          <div>
            <h2 className="text-xl font-extrabold m-0">Course Discovery</h2>
            <p className="text-sm text-gray-500">
              Find and add courses to your schedule
            </p>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by course name, code, or professor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-2 rounded-lg px-4 py-2"
          />
        </div>

        {/* Course List */}
        <CourseList search={search} />
      </div>
    </div>
  );
}

// ─── Course List ────────────────────────────────────────────────────────

function CourseList({ search }) {
  // Placeholder data - replace with actual course data
  const courses = [
    { id: 1, code: "CS 311", name: "Algorithms", prof: "Dr. Sarah Mitchell", 
      description: "Design and analysis of algorithms, computational complexity theory." },
    { id: 2, code: "CS 349", name: "Machine Learning", prof: "Prof. David Chen", 
      description: "Supervised and unsupervised learning, neural networks, deep learning fundamentals." },
    { id: 3, code: "MATH 330-1", name: "Abstract Algebra", prof: "Dr. Emily Rodriguez", 
      description: "Groups, rings, fields, and their applications to coding theory and cryptography." },
    // Add more courses as needed
  ];

  // Filter courses based on search and selected filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) ||
                          course.code.toLowerCase().includes(search.toLowerCase()) ||
                          course.prof.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="mt-2">
      {filteredCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

// ─── Course Card ────────────────────────────────────────────────────────

function CourseCard({ course }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center mb-3">
      <div style={{ textAlign: 'left' }}>
      <h3>
        <span className="text-lg font-bold">{course.code}</span>
        <span className="ml-2 text-gray-700 font-medium">{course.name}</span>
      </h3>
      <p className="text-sm text-gray-400 font-medium">
        {course.prof}
      </p>
      <p className="text-sm text-gray-600 mt-1 font-medium">
        {course.description}
      </p>
      </div>
      <button className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg whitespace-nowrap shrink-0 shadow-md">
        + Add
      </button>
    </div>
  );
}