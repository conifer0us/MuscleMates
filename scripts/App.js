const e = React.createElement;

function TestMessage() {
  return (
    <div>
      <h1>THIS IS A TESTING PAGE</h1>
      <p>For regular usage, visit /index.html</p>
    </div>
  )
}

function MyButton() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

function NavBar() {
  return (
    <div className="nav-bar-container">
      <div className="nav-bar">
        <div className="logo">
            <h1><a href="/" className="white-link">GYMDER</a></h1>
        </div>
        <div className="links-to-pages">
            <a href="home" className="nav-bar-item smooth-text">Home</a>
            <a href="recommendations" className="nav-bar-item smooth-text">Recommendations</a>
            <a href="friends" className="nav-bar-item smooth-text">Friends</a>
            <a href="matchrequests" className="nav-bar-item smooth-text">Requests</a>
            <a href="profile" className="nav-bar-item smooth-text">Profile</a>
        </div>
    </div>
    </div>
  )
}

function MyApp() {
  return (
    <div>
      <NavBar />
      <div className="tab">
        <TestMessage />
      </div>
      <MyButton />
      <MyButton />
    </div>
  );
}

const app = document.getElementById('app')
ReactDOM.render(e(MyApp), app)
