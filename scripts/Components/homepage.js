import { NavBar } from './shared'

export function HomePage() {
    return (
      <div>
      <NavBar />
      <div>
        <div className="body-of-page">
          <div>
              <h1 id="homepage-title">You're Now Logged In - Welcome Back!</h1>
              <hr/>
              <h3>If you're new here, create a new profile!</h3>
              <h3>If not, click on "Recommendations" to find fellow gym goers to match with!</h3>
              <h3>You'll find your friends and your conversations with them in the "Friends" tab.</h3>
          </div>
        </div>
      </div>
    </div>
    )
}