function Tag({ label }) {
  return <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-md border border-purple-100 shadow-sm">#{label}</span>;
}

function Question({ author, role, title, text, time, tags, replies, votes }) {
  return (
    <div className="bg-white border rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
      <div className="flex flex-col items-center gap-1 min-w-[40px]">
        <button className="text-gray-400 hover:text-purple-600 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
        </button>
        <span className="font-semibold text-gray-700">{votes}</span>
        <button className="text-gray-400 hover:text-red-600 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{author[0]}</div>
          <span className="font-semibold text-gray-700">{author}</span> 
          <span>•</span> 
          <span>{role}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{text}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            {replies} Replies
          </button>
          <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

function QAndA() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Course header */}
      <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Q&A Forum</h1>
          <p className="text-sm font-medium">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">4 Answered</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">1 Unanswered Questions</span>
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Ask a Question
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search bar */}
        <div className="relative flex-1">
          <input type="text" placeholder="Search questions by topic, keyword, or author..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm" />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* Filter options */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-800 shadow-sm rounded-md border border-gray-200">All</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md">Open</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md">My Questions</button>
        </div>
      </div>

      {/* Tag options */}
      <div className="flex flex-wrap gap-2 mb-8 items-center border-b pb-4">
        <span className="text-sm font-semibold text-gray-500 mr-2">Popular tags:</span>
        <button className="hover:opacity-80 transition-opacity"><Tag label="loops" /></button>
        <button className="hover:opacity-80 transition-opacity"><Tag label="conditionals" /></button>
        <button className="hover:opacity-80 transition-opacity"><Tag label="functions" /></button>
        <button className="hover:opacity-80 transition-opacity"><Tag label="arrays" /></button>
        <button className="hover:opacity-80 transition-opacity"><Tag label="objects" /></button>
        <button className="hover:opacity-80 transition-opacity"><Tag label="recursion" /></button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <Question
            author="M. Smith"
            role="Student"
            title="Help needed on Assignment 3"
            text="I'm trying to implement a while loop, but it keeps running forever. Can someone help me figure out what's wrong? I've attached my code snippet below."
            time="2 hours ago"
            tags={['loops', 'logic', 'A3']}
            replies={12}
            votes={23}
        />
        <Question
            author="Jordan Lee"
            role="Student"
            title="Difference between pass by value and pass by reference?"
            text="I'm confused about what happens when you modify parameters inside a function. Can someone explain with examples? Specifically in context of changing array elements."
            time="5 hours ago"
            tags={['midterm_review', 'functions', 'concepts']}
            replies={18}
            votes={45}
        />
        <Question
            author="Prof. Davis"
            role="Instructor"
            title="Update on Midterm Grades"
            text="The midterm grades have been posted to the canvas page. The class average was 82%. Please come to office hours if you have any questions before next week."
            time="1 day ago"
            tags={['announcement', 'midterm', 'grades']}
            replies={34}
            votes={105}
        />
      </div>
    </div>
  );
}

export default QAndA;
