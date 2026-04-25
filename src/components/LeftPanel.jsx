export default function LeftPanel() {
    return (
      <div className="hidden lg:flex flex-col bg-[#3B1A61] min-h-screen w-1/2 p-12 relative overflow-hidden">
  
        {/* decorative circles */}
        <div className="absolute w-[520px] h-[520px] rounded-full border border-white/5 -top-40 -right-48 pointer-events-none" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-white/5 -top-16 -right-20 pointer-events-none" />
        <div className="absolute w-[340px] h-[340px] rounded-full border border-white/5 -bottom-24 -left-28 pointer-events-none" />
  
        {/* logo */}
        <div className="relative z-10 mb-20">
          <span className="font-serif text-white text-[22px] tracking-tight">ClassHub</span>
        </div>
  
        {/* hero */}
        <div className="relative z-10 flex flex-col justify-center flex-1">
          <h1 className="font-serif text-white text-[44px] leading-[1.12] tracking-tight mb-12">
            Connect, learn,<br />
            and <em className="text-[#C9A8E8] not-italic italic">mentor</em><br />
            your peers.
          </h1>
  
          <div className="flex flex-col gap-7">
            {/* Chat */}
            <div className="flex gap-4 items-start">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">Class Chat &amp; Q&amp;A</p>
                <p className="text-white/55 text-[13px] leading-[1.55]">Ask questions, share resources, and discuss course material with your classmates in real time.</p>
              </div>
            </div>
  
            {/* Mentors */}
            <div className="flex gap-4 items-start">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">Upperclassmen Mentors</p>
                <p className="text-white/55 text-[13px] leading-[1.55]">Get help from students who previously took your course — they know exactly what to study.</p>
              </div>
            </div>
  
            {/* Resources */}
            <div className="flex gap-4 items-start">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">Study Resources</p>
                <p className="text-white/55 text-[13px] leading-[1.55]">Access notes, guides, and cheat sheets shared by classmates across all your courses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  