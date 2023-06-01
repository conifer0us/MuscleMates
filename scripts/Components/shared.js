export function NavBar() {
    return (
      <div className="nav-bar-container">
        <div className="nav-bar">
          <div className="logo">
              <h1><a href="/home" className="white-link logotext">GYMDER</a></h1>
          </div>
          <div className="links-to-pages">
              <a href="/recommendations" className="nav-bar-item smooth-text">Recommendations</a>
              <a href="/friends" className="nav-bar-item smooth-text">Friends</a>
              <a href="/profile" className="nav-bar-item smooth-text">Profile</a>
          </div>
        </div>
      </div>
    )
}

export function BackToHomeArrow() {
  return (
    <h1><a className="backtohomelogin smooth-text" href="/index.html">⇦ Back to Home</a></h1>
  )
}

export function BackArrow() {
  return (
    <h1><a className="backtohomelogin smooth-text back" href="/friends">⇦</a></h1>
  )
}
