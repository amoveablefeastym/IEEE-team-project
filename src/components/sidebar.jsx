export default function sidebar(){
    return (
        <aside>
            <div>
                <h1>ClassHub</h1> {/*main heading*/}
            </div>

            <nav>
                <p>MAIN</p>

                <ul>
                    <li>Dashboard</li>
                    <li>Academics</li>
                </ul>
            </nav>
            {/**Class Section */}
            <nav>
                <p>MY CLASSES</p>
                <button>+</button>

                <ul>
                    <li>Class One</li>
                    <li>Class Two</li>
                    <li>Class Three</li>
                </ul>
            </nav>
            {/** Community Section */}
            <nav>
                <p>
                    COMMUNITY
                </p>

                <ul>
                    <li>Student Groups</li>
                    <li>Settings</li>

                </ul>
            </nav>

            {/*User Profile Section */}
            <div>
                <div>UN</div>

                <div>
                    <p>Name</p>
                    <p>Major</p>
                    <p>Grade</p>
                </div>

                {/**Log out button */}
                <button>--</button>
            </div>
        </aside>
    )
}