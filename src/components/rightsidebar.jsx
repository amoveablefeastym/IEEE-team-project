// Right sidebar shows class members and mentors

export default function RightSidebar() {
    return(
        <aside className="w-72 bg-white border-l h-screen p-6 flex flex-col gap-8 hidden lg:flex overflow-y-auto">
            
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800">Class Members (124)</h3>
                </div>

                {/**Class Members */}
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center text-sm shadow-sm group-hover:ring-2 ring-purple-300">A</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Alex Chen</p>
                            <p className="text-xs text-gray-500">Junior • CS</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center text-sm shadow-sm group-hover:ring-2 ring-amber-300">C</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">Chris Smith</p>
                            <p className="text-xs text-gray-500">Freshman • EE</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800">Upperclassmen Mentors</h3>
                    <a href="#" className="text-xs text-purple-600 font-medium hover:underline">View All</a>
                </div>

                {/**Mentor placeholder */}
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 cursor-pointer hover:bg-gray-100">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center text-sm">M</div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Maria Garcia</p>
                        <p className="text-xs text-gray-500">Senior • CS</p>
                    </div>
                </div>
            </div>

            {/**Mentor Banner */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-purple-100 mt-auto shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    Become a Mentor!
                </h4>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">Share your knowledge and help your peers succeed in this class.</p>
                <button className="w-full text-sm font-semibold bg-white text-purple-600 border border-purple-200 py-2 rounded-lg hover:bg-purple-50 transition-colors shadow-sm">Learn More</button>
            </div>

        </aside>
    )
}
