import { NavBar } from './shared'

export function HomePage() {
    return (
      <div>
        <NavBar />
        <div>
          <div className="body-of-page">
            <div>
                <h1 id="homepage-title">Logged In Home Page - Welcome Back!</h1>
                <hr/>
                <h2>This page will be populated with information and other app components</h2>
            </div>
            <p>Welcome to your dashboard!</p>
          </div>
        </div>
      </div>
    )
}