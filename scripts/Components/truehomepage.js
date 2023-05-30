export function TrueHomePage() {
    return (
        <div className="tab">
            <div className="homepage-navbar">
                <h1><a href="/login.html" className="orange-link smooth-text nodecorationlink">Log In</a></h1>
                <h1><a href="/signup.html" className="orange-link smooth-text nodecorationlink">Sign Up</a></h1>
                <h1><a href="/about" className="orange-link smooth-text nodecorationlink">About</a></h1>
            </div>
            <div className="centering-div">
                <div className="homepage-main-titles">
                    <h1 id="home-title">GYMDER</h1>
                    <h2>Small description or slogan</h2>
                </div>
            </div>

            <h1>What we do</h1>
            <h3>Elevator pitch of the project and quickly explain features</h3>
            <h3>Couple of screenshots and/or stock photos</h3>

            <h1>Who we are</h1>
            <h3>Description of team members and a bit of project</h3>
            <a href="/about"><button>About the project</button></a>
        </div>
    )
}
