export default function Header() {
    return(
        <header className="bg-white border-b px-6 py-4 flex flex-col gap-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">CS214 - Data Structures and Algorithms</h2>
                    <p className="text-sm text-gray-500 font-medium">Spring Quarter</p>
                </div>
                {/**Search and Notification */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input className="px-4 py-2 bg-gray-100 rounded-full text-sm border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none w-64" type="search" placeholder="Search in class..."/>
                        <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/**Navigation Tabs */}
            <nav className="border-t pt-2 mt-2 -mb-4">
                <ul className="flex gap-6 text-sm font-medium text-gray-500">
                    <li className="pb-3 border-b-2 border-transparent hover:text-gray-800 cursor-pointer">Chat</li>
                    <li className="pb-3 border-b-2 border-purple-600 text-purple-600 cursor-pointer">Q&A</li>
                    <li className="pb-3 border-b-2 border-transparent hover:text-gray-800 cursor-pointer">Study Sessions</li>
                    <li className="pb-3 border-b-2 border-transparent hover:text-gray-800 cursor-pointer">Mentorship</li>
                </ul>
            </nav>
        </header>
    )
}