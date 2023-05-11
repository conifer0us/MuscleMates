import { useState, useEffect } from "react";

export function MessagePage() {

    let [messagesData, setMessagesData] = useState(["Message1", "Message2", "Message3"])
    const [currentMessageData, setCurrentMessageData] = useState("")

    useEffect(() => {
        fetchAllMessages()
    }, [messagesData])

    function fetchAllMessages() {
        console.log("Fetching Messages")
        fetch("message-endpoint")
        .then((res) => {
            res.json().then((JSONData) => {
                setMessagesData(JSONData)
            })
        })
    }

    function sendMessage() {
        console.log(`Posting New Message: ${currentMessageData}`)
        setMessagesData(currentMessageData)
        fetch(`/submit${window.location.pathname}`, {method: "POST", body: new FormData(document.getElementById("messagesubmit"))})
        .then((res) => {
            res.json().then(JSONData => {
                setMessagesData(JSONData)
            })
        })
    }

    function changeWordData(e) {
        setCurrentMessageData(e.target.value)
    }

    function SeeMessagesData() {
        return (
            <ul style={{color: "white"}}>{messagesData.map((message) => {return <li key={`message-${message}`}>{message}</li>})}</ul>
        )
    }

    return (
        <>
            <div className="tab">
                <h2><a className="orange-link" href="/friends">Back to Friends Page</a></h2>
                <div id="messages-container">
                    {/* <SeeMessagesData /> */}
                </div>
                <form id="messagesubmit" onSubmit={sendMessage}>
                    <input name="message" placeholder="Type Message" value={currentMessageData} onChange={changeWordData}></input>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </>
    )
}