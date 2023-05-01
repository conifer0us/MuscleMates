import { NavBar } from './shared'
import { useState, useEffect } from 'react'

function SentRequestDiv(username, fullname, gym, age, bio) {
    return (
      <div className="recommendation-container" username={username}>
        <div className="recommendation cancel-request" onClick={() => cancelMatchRequest(username)}>
            <div className="rec-info-container">
                <div className="rec-profile-pic"></div>
                <div className="rec-info">
                    <div className="rec-info-parameters">
                        <div className="rec-info-parameters-names">
                            <div className="rec-info-parameters-fullname">
                                <p className="rec-info-parameters-fullname-text">{fullname}</p>
                            </div>
                                <div className="rec-info-parameters-username">
                                    <p className="rec-info-parameters-username-text">{username}</p>
                                </div>
                            </div>
                            <div className="rec-info-parameters-days">
                                <p className="rec-info-parameters-title">Days: </p>
                                <div className="rec-info-parameters-seven-days">
                                    <p className="rec-info-parameters-seven-days-day">M</p>
                                    <p className="rec-info-parameters-seven-days-day">T</p>
                                    <p className="rec-info-parameters-seven-days-day">W</p>
                                    <p className="rec-info-parameters-seven-days-day">T</p>
                                    <p className="rec-info-parameters-seven-days-day">F</p>
                                    <p className="rec-info-parameters-seven-days-day">S</p>
                                    <p className="rec-info-parameters-seven-days-day">S</p>
                                </div>
                            </div>
                            <div className="rec-info-parameters-gym">
                                <p className="rec-info-parameters-title">Gym: </p>
                                <p className="rec-info-parameters-gym-text">{gym}</p>
                            </div>
                            <div className="rec-info-parameters-age">
                                <p className="rec-info-parameters-title">Age: </p>
                                <p className="rec-info-parameters-age-text">{age}</p>
                            </div>
                      </div>
                      <div className="rec-info-bio">
                          <p className="rec-info-bio-text">{bio}</p>
                      </div>
                  </div>
              </div>
              <span className="arrow-send material-symbols-outlined">close</span>
          </div>
      </div>
    )
}
  
function ReceivedRequestDiv(username, fullname, gym, age, bio) {
    return (
      <div className="recommendation-container" username={username}>
        <div className="recommendation accept-request" onClick={() => acceptMatchRequest(username)}>
            <div className="rec-info-container">
                <div className="rec-profile-pic"></div>
                <div className="rec-info">
                    <div className="rec-info-parameters">
                        <div className="rec-info-parameters-names">
                            <div className="rec-info-parameters-fullname">
                                <p className="rec-info-parameters-fullname-text">{fullname}</p>
                            </div>
                                <div className="rec-info-parameters-username">
                                    <p className="rec-info-parameters-username-text">{username}</p>
                                </div>
                            </div>
                            <div className="rec-info-parameters-days">
                                <p className="rec-info-parameters-title">Days: </p>
                                <div className="rec-info-parameters-seven-days">
                                    <p className="rec-info-parameters-seven-days-day">M</p>
                                    <p className="rec-info-parameters-seven-days-day">T</p>
                                    <p className="rec-info-parameters-seven-days-day">W</p>
                                    <p className="rec-info-parameters-seven-days-day">T</p>
                                    <p className="rec-info-parameters-seven-days-day">F</p>
                                    <p className="rec-info-parameters-seven-days-day">S</p>
                                    <p className="rec-info-parameters-seven-days-day">S</p>
                                </div>
                            </div>
                            <div className="rec-info-parameters-gym">
                                <p className="rec-info-parameters-title">Gym: </p>
                                <p className="rec-info-parameters-gym-text">{gym}</p>
                            </div>
                            <div className="rec-info-parameters-age">
                                <p className="rec-info-parameters-title">Age: </p>
                                <p className="rec-info-parameters-age-text">{age}</p>
                            </div>
                      </div>
                      <div className="rec-info-bio">
                          <p className="rec-info-bio-text">{bio}</p>
                      </div>
                  </div>
              </div>
              <span className="arrow-send material-symbols-outlined">done</span>
          </div>
      </div>
    )
}

function acceptMatchRequest(username) {
    fetch("/submit/acceptreq/" + username, {method: "POST"})
    .then((response) => {
        if (response.status == 200) {
            alert("Match request accepted, you are now friends!")
            document.querySelector(`div[username=${username}]`).closest("li").remove()
        }
        else {
            alert("Something went wrong")
        }
    })
}
  
function cancelMatchRequest(username) {
    fetch("/submit/cancelreq/" + username, {method:"POST"})
    .then((response) => {
        if (response.status == 200) {
            alert("Sent match request successfully cancelled")
            document.querySelector(`div[username=${username}]`).closest("li").remove()
        }
        else {
            alert("Something went wrong")
        }
    })
}

export function MatchRequestsPage() {

    let receivedRequestsList = []
    let sentRequestsList = []
  
    const [receivedRequests, setReceivedRequests] = useState([])
    const [sentRequests, setSentRequests] = useState([])
  
    useEffect(() => {
      getMatchesReceivedUsernames();
      getMatchesSentUsernames();
    }, [])
  
    function getMatchesReceivedUsernames() {
      fetch("/api/received")
      .then((response) => {
          response.json().then((JSONData) => {
              let nreceived = JSONData["received"].length
              if (nreceived  == 0) {
                  setReceivedRequests(<h3>No match requests received</h3>)
              }
              for (let i=0; i<JSONData["received"].length; i++) {
                let username = JSONData["received"][i]
                fetch(`/api/profile/${username}`).then((response) => {
                  response.json().then((JSONData) => {
                    receivedRequestsList.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"]})
                    setReceivedRequests(receivedRequestsList.map((rrequest) => <li key={`${username}-rrequest`}>{ReceivedRequestDiv(rrequest.username, rrequest.name, rrequest.gym, rrequest.age, rrequest.bio)}</li>))
                  })
                })
              }
          })
      })
    }
  
    function getMatchesSentUsernames() {
      fetch("/api/sent")
      .then((response) => {
          response.json().then((JSONData) => {
              let nsent = JSONData["send"].length
              if (nsent  == 0) {
                setSentRequests(<h3>No match requests sent</h3>)
              }
              for (let i=0; i<JSONData["send"].length; i++) {
                let username = JSONData["send"][i]
                fetch(`/api/profile/${username}`).then((response) => {
                  response.json().then((JSONData) => {
                    sentRequestsList.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"]})
                    setSentRequests(sentRequestsList.map((srequest) => <li key={`${username}-srequest`}>{SentRequestDiv(srequest.username, srequest.name, srequest.gym, srequest.age, srequest.bio)}</li>))
                  })
                })
              }
          })
      })
    }
  
  return (
      <>
        <NavBar />
        <div id="reqs-received-body">
            <div className='recs-title-link-div'>
                <h1 className='tab'>Requests Received</h1>
                <h2><a href="recommendations" className="orange-link">Back to Recommendations</a></h2>
            </div>
          <ul className='tab'>{receivedRequests}</ul>
        </div>
        <div id="reqs-sent-body" className='tab'>
          <h1>Requests Sent</h1>
          <ul>{sentRequests}</ul>
        </div>
      </>
    )
}