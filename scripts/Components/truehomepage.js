export function TrueHomePage() {
    return (
        <div>
            <div className="homepage-navbar">
                <h1><a href="/login.html" className="orange-link smooth-text nodecorationlink">Log In</a></h1>
                <h1><a href="/signup.html" className="orange-link smooth-text nodecorationlink">Sign Up</a></h1>
            </div>

            <div className="centering-div">
                <div className="homepage-main-titles">
                    <div>
                        <h1 id="home-title">MUSCLE MATES</h1>
                        <hr id="homepage-hr"/>
                    </div>
                    <h2>Let's get motivated, together</h2>
                </div>
            </div>

            <div className="homepage-content-container">
                <div className="homepage-content-image-container">
                    <div className="homepage-content-div">
                        <h1>What is Muscle Mates?</h1>
                        <h3>Muscle Mates is a social networking web application that will match you with other gym goers that have similar workout plans as you!</h3>
                        <h3>Our recommendation algorithm will present you with the users that you are most compatible with, and you can filter users and modify your preferences at any time.</h3>
                        <h3>Once you have found your dream workout buddy, and friend requests have been sent and accepted, you can get to know each other and arrange your meet-ups through our private messaging feature!</h3>
                    </div>
                    <img src="/image/Running.jpg" className="homepageimg"/>
                </div>

                <div className="homepage-content-image-container">
                    <img src="/image/Weightlifting.jpg" className="homepageimg"/>
                    <div className="homepage-content-div">
                        <h1>Who is Muscle Mates for?</h1>
                        <div>
                            <h3>
                                Do you feel unmotivated to go to the gym alone? Do you feel like you need someone else to make you accountable?
                                Perhaps you're intimidated to go by yourself, or you want to adhere to someone else's workout routine. Maybe you want to meet new people with similar interests to yours, 
                                or you want to find someone to play a sport you enjoy with!
                            </h3>
                            <h3>
                                If you think any of these apply to you then you're in luck, because Muscle Mates is perfect for you!
                                Whether you're new to working out or an experienced gym-goer, you'll easily find someone who will fit your needs!
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="homepage-content-image-container">
                    <div className="homepage-content-div">
                        <h1>Why did we create Muscle Mates?</h1>
                        <h3>
                            We want to encourage and support people to maintain a healthy lifestyle.
                            We know it's a struggle to find the motivation to go to the gym or do physical activity, and we made it our mission to try to minimize that friction as much as possible.
                            It's also difficult to branch out and socialize post-covid, so we wanted to create a way to help others find a sense of belonging within a specific community of their choice.
                        </h3>
                    </div>
                    <img src="/image/BigGym.jpg" className="homepageimg"/>
                </div>

                <div className="homepage-content-div homepage-footer">
                    <h1>Hope to see you at the gym!</h1>
                    <p>Shoutout to our fellow Drexel students!</p>
                </div>
                <br/>
            </div>
        </div>
    )
}
