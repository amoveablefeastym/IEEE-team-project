import { useRef } from 'react';

import { useRef } from 'react';

function Tag({ label }) {
  return (
    <span className="inline-block bg-brand-light text-brand text-xxs font-medium px-2 py-0.5 rounded-badge">
      #{label}
    </span>
  );
}

function Question({ author, role, title, text, time, tags, replies, votes }) {
  return (
    <div className="bg-surface rounded-card border border-line p-4 flex gap-4">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 text-muted text-sm min-w-[32px]">
        <button className="hover:text-brand">⬆</button>
        <span className="text-primary font-medium">{votes}</span>
        <button className="hover:text-brand">⬇</button>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-label text-sub">{author} • {role}</span>
          <span className="text-xxs text-muted">{time}</span>
        </div>
        <h3 className="text-primary font-semibold mb-1">{title}</h3>
        <p className="text-sub text-sm mb-3">{text}</p>

        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>

        <span className="text-xxs text-muted">View {replies} replies</span>
      </div>
    </div>
  );
}
const scrollRef = useRef(null);
  const scrollAmount = 320;

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -scrollAmount, left: 0, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: scrollAmount, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex-1 overflow-hidden p-6">
      <div ref={scrollRef} className="h-full overflow-y-auto pr-2 space-y-4">
        {/* Course header */}
        <div className="bg-surface rounded-card border border-line p-4 flex items-center justify-between">
          <div>
            <h2 className="text-primary font-bold text-lg">CS214 - Data Structures and Algorithms</h2>
            <p className="text-label text-sub mt-0.5">
              <span className="text-brand font-medium">4 Answered</span>
              <span className="mx-1 text-muted">|</span>
              <span>1 Unanswered</span>
            </p>
          </div>
          <button className="bg-brand hover:bg-brand-hover text-white text-label font-medium px-4 py-2 rounded-btn transition-colors">
            + Ask a Question
          </button>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search questions by topic, keyword, or author..."
          className="w-full bg-surface border border-line rounded-btn px-4 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand"
        />

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button className="bg-brand text-white text-label px-3 py-1.5 rounded-btn">All</button>
          <button className="bg-surface border border-line text-sub text-label px-3 py-1.5 rounded-btn hover:border-brand hover:text-brand transition-colors">Open Questions</button>
          <button className="bg-surface border border-line text-sub text-label px-3 py-1.5 rounded-btn hover:border-brand hover:text-brand transition-colors">My Questions</button>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          {['loops', 'conditionals', 'functions', 'arrays', 'objects', 'recursion'].map((tag) => (
            <button key={tag}>
              <Tag label={tag} />
            </button>
          ))}
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

      <div className="pointer-events-none absolute right-4 top-1/2 flex flex-col gap-2 -translate-y-1/2">
        <button
          onClick={scrollUp}
          aria-label="Scroll up"
          className="pointer-events-auto rounded-full bg-surface border border-line p-3 text-primary shadow-sm hover:bg-brand hover:text-white transition-colors"
        >
          ▲
        </button>
        <button
          onClick={scrollDown}
          aria-label="Scroll down"
          className="pointer-events-auto rounded-full bg-surface border border-line p-3 text-primary shadow-sm hover:bg-brand hover:text-white transition-colors"
        >
          ▼
        </button>
      </div   time="2 hours ago"
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

      <div className="pointer-events-none absolute right-4 top-1/2 flex flex-col gap-2 -translate-y-1/2">
        <button
          onClick={scrollUp}
          aria-label="Scroll up"
          className="pointer-events-auto rounded-full bg-surface border border-line p-3 text-primary shadow-sm hover:bg-brand hover:text-white transition-colors"
        >
          ▲
        </button>
        <button
          onClick={scrollDown}
          aria-label="Scroll down"
          className="pointer-events-auto rounded-full bg-surface border border-line p-3 text-primary shadow-sm hover:bg-brand hover:text-white transition-colors"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default QAndA;
