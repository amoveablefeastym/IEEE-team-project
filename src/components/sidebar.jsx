export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r h-screen p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">ClassHub</h1>
            </div>

            <div className="flex-1 space-y-6">
                <nav>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Main</p>
                    <ul className="space-y-1">
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer font-medium">Dashboard</li>
                        <li className="px-3 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer font-medium">Academics</li>
                    </ul>
                </nav>

                <nav>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">My Classes</p>
                        <button className="text-gray-400 hover:text-gray-600">+</button>
                    </div>
                    <ul className="space-y-1">
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Class One</li>
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Class Two</li>
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Class Three</li>
                    </ul>
                </nav>

                <nav>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Community</p>
                    <ul className="space-y-1">
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Student Groups</li>
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Settings</li>
                    </ul>
                </nav>
            </div>

            <div className="mt-auto border-t pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center">UN</div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">User Name</p>
                    <p className="text-xs text-gray-500">CS Major • Junior</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                </button>
            </div>
        </aside>
    )
}