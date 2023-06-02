export function NavBar() {
    return (
      <div className="nav-bar-container">
        <div className="nav-bar">
          <div className="logo">
              <a href="/" className="white-link logocontainer"><img src="/image/favicon.ico" className="navbar-logo" /><h1 className="logotext">Muscle Mates</h1></a>
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
    <h1><a className="backtohomelogin smooth-text" href="/">⇦ Back to Home</a></h1>
  )
}

export function BackArrow() {
  return (
    <h1><a className="backtohomelogin smooth-text back" onClick={() => {history.back()}} style={{cursor: 'pointer'}}>⇦ Back</a></h1>
  )
}
