function TestMessage() {
    return (
      <div>
        <h1>THIS IS A TESTING PAGE</h1>
        <p>For regular usage, visit /index.html</p>
      </div>
    )
}
  
function MyButton() {
    const [count, setCount] = useState(0);
  
    function handleClick() {
      setCount(count + 1);
    }
  
    return (
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
    );
}

export function MyApp() {
    return (
      <div>
        <NavBar />
        <div className="tab">
          <TestMessage />
        </div>
        <MyButton />
        <MyButton />
        <input placeholder="Test input" type="text" name="username" className="smooth-background"></input>
      </div>
    );
}