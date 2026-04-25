import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function CourseDiscovery({ onClose }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  // fallback close handler if parent doesn't provide one
  const close = onClose || (() => {
    // try to go back in history; fall back to home
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  })

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2>Course Discovery</h2>
            <p>Find and add courses to your schedule</p>
          </div>
          <button onClick={close}>✕</button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by course name, code, or professor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
    <div>
      {filteredCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

// ─── Course Card ────────────────────────────────────────────────────────

function CourseCard({ course }) {
  return (
    <div style={{ 
      border: "1px solid gray", 
      margin: "10px", 
      padding: "10px",
      borderRadius: "8px" 
    }}>
      <h3>{course.code} — {course.name}</h3>
      <p style={{ fontWeight: "500", color: "gray" }}>
        {course.prof}
      </p>
      <p>{course.description}</p>
      <button onClick={() => console.log("Added", course.id)}>
        + Add
      </button>
    </div>
  );
}