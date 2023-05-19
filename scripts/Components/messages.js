import { useState, useEffect } from "react";

let ownUsername = "";

export function MessagePage() {

    let [messagesData, setMessagesData] = useState([['','','']]);
    const [dumbthing, setDumbthing] = useState(0)

    let displayedmessageslist = [];

    let currentMessageData = "";

    let userMessaged = window.location.pathname.split("/")[2];

    useEffect(() => {
        startMessageLoader();
        setInterval(fetchPeriodic, 500);
    }, [])

    async function startMessageLoader() {
        const res = await fetch("/api/myusername");
        ownUsername = (await res.text()).replaceAll('"','');
        console.log(`🍓🍓Hi ${ownUsername}!🍓🍓`)
        fetchAllMessages(25);
    }

    function fetchAllMessages(num) {
        fetch(`/api/message/${userMessaged}/?num=${num}&startindex=-1`)
        .then((res) => {
            res.json().then((JSONData) => {
                for (const key in JSONData) {
                    if (JSONData[key].sender == ownUsername) {
                        displayedmessageslist.unshift([ownUsername, JSONData[key].data, key]);
                    }
                    else {
                        displayedmessageslist.unshift([userMessaged, JSONData[key].data, key]);
                    }
                    setMessagesData(displayedmessageslist);
                }
                //setDumbthing((prevstate) => prevstate + 1);
            })
        })
    }

    async function fetchPeriodic() {
        let res = await fetch(`/api/message/${userMessaged}/?num=1&startindex=-1`);
        let JSONData = await res.json();
        for (const key in JSONData) {
            if (key != displayedmessageslist[0][2]) {
                displayedmessageslist.unshift([JSONData[key].sender, JSONData[key].data, key]);
                setMessagesData(displayedmessageslist);
                setDumbthing((prevstate) => prevstate + 1);
            }
        }
    }

    function sendMessage() {
        setMessagesData(messagesData.concat([currentMessageData]))
        fetch(`/submit/message/${userMessaged}`, {method: "POST", body: new FormData(document.getElementById("messagesubmit"))})
        currentMessageData = ""
        document.getElementById("message-input").value = ""
        fetchAllMessages(messagesData.length + 1);
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
                        return <li className="received-message" id={message[2]} key={message[2]}><div>{message[1]}</div></li>
                    }
                    else {
                        return <li className="sent-message" id={message[2]} key={message[2]}><div>{message[1]}</div></li>
                    }
                })}</ul>
            )
        }
    }

    function loadMoreMessages() {
        fetchAllMessages(messagesData.length + 10);
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
                    <input id="message-input" name="message" placeholder="Type Message" autoComplete="off" onChange={changeWordData}></input>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </>
    )
}