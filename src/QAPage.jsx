function Tag({ label }) {
  return <span className="tag">#{label}</span>;
}

function Question({ author, title, text, time, tags, replies, votes }) {
  return (
    <div className="question">
      <div className="question-content">{title}
        <div className="question-header">
          {author} • {role}
        </div>
        <h1>{title}</h1>
        <p>{text}</p>

        <div className="question-tags">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>

        <div className="question-replies">
          View {replies} replies
        </div>

        <div className="question-votes">
          <div>⬆</div>
          {votes}
          <div>⬇</div>
        </div>
      </div>
      <div className="question-time">{time}</div>
    </div>
  );
}

function QAndA() {
  return (
    <div className="q-and-a">
      {/* Course header */}
      <div className="course-header">
        <h1>CS214 - Data Structures and Algorithms</h1>
        <p>
          <span className="answered">4 Answered</span> |
          <span className="unanswered"> 1 Unanswered Questions</span>
        </p>
        <button className="add-question">+ Ask a Question</button>

      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search questions by topic, keyword, or author..." />
      </div>

      {/* Filter options */}
      <div className="filter-options">
        <button className="filter-btn">All</button>
        <button className="filter-btn">Open Questions</button>
        <button className="filter-btn">My Questions</button>
      </div>

      {/* Tag options */}
      <div className="tag-options">
        <button className="tag-btn">
          <Tag label="loops" />
        </button>
        <button className="tag-btn">
          <Tag label="conditionals" />
        </button>
        <button className="tag-btn">
          <Tag label="functions" />
        </button>
        <button className="tag-btn">
          <Tag label="arrays" />
        </button>
        <button className="tag-btn">
          <Tag label="objects" />
        </button>
        <button className="tag-btn">
          <Tag label="recursion" />
        </button>
      </div>

      {/* Questions */}
      <Question
        author="M. Smith"
        role="Student"
        title="Help needed on Assignment 3"
        text="I'm trying to implement a while loop, but it keeps running forever. Can someone help me figure out what's wrong?"
        time="2 hours ago"
        tags={['loops', 'logic', 'A3']}
        replies={12}
        votes={23}
      />
      <Question
        author="Jordan Lee"
        role="Student"
        title="Difference between pass by value and pass by reference?"
        text="I'm confused about what happens when you modify parameters inside a function. Can someone explain with examples?"
        time="5 hours ago"
        tags={['midterm_review', 'functions', 'concepts']}
        replies={18}
        votes={45}
      />
    </div>
  );
}

export default QAndA;