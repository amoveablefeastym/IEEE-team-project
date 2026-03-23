// Sits at the top of the main content area
export default function header() {
    return(
        <header>
            <div>
                <h2>CLASS NAME</h2>
                <p>Quarter</p>
            </div>
            {/**Search and Notification */}
            <div>
                <input type="search" placeholder="Search in class..."/>
                <button>Bell</button>
            </div>

            {/**Navigation Tabs */}
            <nav>
                <ul>
                    <li>Chat</li>
                    <li>Q&A</li>
                    <li>Study Sessions</li>
                    <li>Mentorship</li>
                </ul>
            </nav>
        </header>
    )
}