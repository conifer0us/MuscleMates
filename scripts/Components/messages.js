import { useState, useEffect } from "react";

export function MessagePage() {

    const [messagesData, setMessagesData] = useState([])

    let currentMessageData = ""

    let displayedmessageslist = []

    let ownUsername = "";

    let userMessaged = window.location.pathname.split("/")[2]

    useEffect(() => {
        fetchOwnUsername()
        window.addEventListener('load', () => setInterval(fetchPeriodic, 500))
    }, [])

    function fetchOwnUsername(origin = 'initial') {
        fetch("/api/myusername")
        .then((res) => {
            res.text().then((textdata) => {
                ownUsername = textdata.replaceAll('"','')
                if (origin == 'message-sent') {
                    fetchAllMessages(messagesData.length + 1)
                }
                else if (origin == 'see-more-button') {
                    fetchAllMessages(messagesData.length + 10)
                }
                else {
                    fetchAllMessages(10)
                }
            })
        })
    }


    function fetchAllMessages(num) {
        console.log("Fetching Messages:")
        fetch(`/api/message/${userMessaged}/?num=${num}&startindex=-1`)
        .then((res) => {
            res.json().then((JSONData) => {
                for (const key in JSONData) {
                    if (JSONData[key].sender == ownUsername) {
                        displayedmessageslist.unshift([ownUsername, JSONData[key].data])
                    }
                    else {
                        displayedmessageslist.unshift([userMessaged, JSONData[key].data])
                    }
                    setMessagesData(displayedmessageslist)
                }
            })
        })
    }

    function fetchPeriodic() {
        fetch(`/api/message/${userMessaged}/?num=1&startindex=-1`)
        .then((res) => {
            res.json().then((JSONData) => {
                for (const key in JSONData) {
                    console.log(JSONData[key].data,"         ",displayedmessageslist[0][1])
                    if (JSONData[key].data != displayedmessageslist[0][1]) {
                        fetchAllMessages(1)
                    }
                }
            })
        })
    }

    function sendMessage() {
        setMessagesData(messagesData.concat([currentMessageData]))
        fetch(`/submit/message/${userMessaged}`, {method: "POST", body: new FormData(document.getElementById("messagesubmit"))})
        console.log("Submitted message: ", currentMessageData)
        currentMessageData = ""
        document.getElementById("message-input").value = ""
        fetchOwnUsername('message-sent')
    }

    function changeWordData(e) {
        //setCurrentMessageData(e.target.value)
        currentMessageData = e.target.value
    }

    function SeeMessagesData() {
        if (messagesData.length == 0) {
            return <h2>No messages to show</h2>
        }
        else {
            return (
                <ul id="messages-list">{messagesData.map((message) => {
                    if (message[0] == userMessaged) {
                        return <li className="received-message"><div>{message[1]}</div></li>
                    }
                    else {
                        return <li className="sent-message"><div>{message[1]}</div></li>
                    }
                })}</ul>
            )
        }
    }

    function loadMoreMessages() {
        fetchOwnUsername('see-more-button')
    }

    return (
        <>
            <div className="tab">
                <h2 id="top-container-messages"><a className="orange-link" href="/friends">Back to Friends Page</a><button id="show-more-messages" onClick={loadMoreMessages}>See more</button></h2>
                <div id="messages-container">
                    <SeeMessagesData />
                </div>
                <form id="messagesubmit" onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                    }}>
                    <input id="message-input" name="message" placeholder="Type Message" onChange={changeWordData}></input>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </>
    )
}