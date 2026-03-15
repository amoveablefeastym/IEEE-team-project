// Right sidebar shows class members and mentors

export default function rightsidebar(){
    return(
        <aside>

            <div>
                <h3>Class Members</h3>

                {/**Class Members */}
                <ul>
                    <li>
                        <div>A</div> {/**avatar */}
                        <div>
                            <p>Member Name</p>
                            <p>Year • Major</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div>
                <h3>Upperclassmen Mentors</h3>
                <a href="#">View All</a>

                {/**Mentor placeholder */}
                <div>
                    <div>A</div>
                    <div>
                        <p>Mentor Name</p>
                        <p>Year • Major</p>
                    </div>
                    <button>Message</button>
                </div>
            </div>

            {/**Mentor Banner */}
            <div>
                <h4>Become a Mentor!</h4>
                <p>Share your knowledge and help your peers succeed in this class</p>
                <button>Learn More</button>
            </div>

        </aside>
    )
}