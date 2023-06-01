import { NavBar } from './shared'
import { useState, useEffect } from 'react'
import { loadImageToTag } from '../formsubmission';

function SentRequestDiv(props) {

    const {username, fullname, gym, age, bio, pronouns, schedule} = props;

    const [dumbthing2, setdumbthing2] = useState(0);

    useEffect(() => {
      loadImageToTag(document.getElementById(`img_${username}`), username);
    }, []);

    return (
        <div className="recommendation-container" username={username}>
        <div className="recommendation cancel-request" onClick={() => cancelMatchRequest(username)}>
            <div className="rec-info-container">
                <div className="rec-profile-pic">
                  <img className='profimg' id={`img_${username}`}/>
                </div>
                <div className="rec-info">
                    <div className="rec-info-parameters">
                        <div className="rec-info-parameters-names">
                            <div className="rec-info-parameters-fullname">
                              <p className="rec-info-parameters-fullname-text">{fullname}</p>
                             </div>
                            <div className="rec-info-parameters-fullname">
                                <p className="rec-info-parameters-fullname-text">{`(${pronouns})`}</p>
                            </div>
                            <div className="rec-info-parameters-username">
                                <p className="rec-info-parameters-username-text">{username}</p>
                            </div>
                        </div>
                            <div className="rec-info-parameters-days">
                                <p className="rec-info-parameters-title">Days: </p>
                                <div className="rec-info-parameters-seven-days">
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[0] == "1") ? "#EE8434" : "#CCC9DC"}}>M</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[1] == "1") ? "#EE8434" : "#CCC9DC"}}>T</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[2] == "1") ? "#EE8434" : "#CCC9DC"}}>W</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[3] == "1") ? "#EE8434" : "#CCC9DC"}}>T</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[4] == "1") ? "#EE8434" : "#CCC9DC"}}>F</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[5] == "1") ? "#EE8434" : "#CCC9DC"}}>S</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[6] == "1") ? "#EE8434" : "#CCC9DC"}}>S</p>
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
  
function ReceivedRequestDiv(props) {

    const {username, fullname, gym, age, bio, pronouns, schedule} = props;

    const [dumbthing2, setdumbthing2] = useState(0);

    useEffect(() => {
      loadImageToTag(document.getElementById(`img_${username}`), username);
    }, []);

    return (
        <div className="recommendation-container" username={username}>
        <div className="recommendation accept-request" onClick={() => acceptMatchRequest(username)}>
            <div className="rec-info-container">
                <div className="rec-profile-pic">
                  <img className='profimg' id={`img_${username}`}/>
                </div>
                <div className="rec-info">
                    <div className="rec-info-parameters">
                        <div className="rec-info-parameters-names">
                            <div className="rec-info-parameters-fullname">
                              <p className="rec-info-parameters-fullname-text">{fullname}</p>
                             </div>
                            <div className="rec-info-parameters-fullname">
                                <p className="rec-info-parameters-fullname-text">{`(${pronouns})`}</p>
                            </div>
                            <div className="rec-info-parameters-username">
                                <p className="rec-info-parameters-username-text">{username}</p>
                            </div>
                        </div>
                            <div className="rec-info-parameters-days">
                                <p className="rec-info-parameters-title">Days: </p>
                                <div className="rec-info-parameters-seven-days">
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[0] == "1") ? "#EE8434" : "#CCC9DC"}}>M</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[1] == "1") ? "#EE8434" : "#CCC9DC"}}>T</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[2] == "1") ? "#EE8434" : "#CCC9DC"}}>W</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[3] == "1") ? "#EE8434" : "#CCC9DC"}}>T</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[4] == "1") ? "#EE8434" : "#CCC9DC"}}>F</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[5] == "1") ? "#EE8434" : "#CCC9DC"}}>S</p>
                                    <p className="rec-info-parameters-seven-days-day" style={{color: (schedule[6] == "1") ? "#EE8434" : "#CCC9DC"}}>S</p>
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
                    receivedRequestsList.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"], pronouns: JSONData["pronouns"], schedule: JSONData["schedule"]})
                    setReceivedRequests(receivedRequestsList.map((rec) => <li key={`${rec.username}-recommendation`}><ReceivedRequestDiv username={rec.username} fullname={rec.name} gym={rec.gym} age={rec.age} bio={rec.bio} pronouns={rec.pronouns} schedule={rec.schedule} /></li>))
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
                    sentRequestsList.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"], pronouns: JSONData["pronouns"], schedule: JSONData["schedule"]})
                    setSentRequests(sentRequestsList.map((rec) => <li key={`${rec.username}-recommendation`}><SentRequestDiv username={rec.username} fullname={rec.name} gym={rec.gym} age={rec.age} bio={rec.bio} pronouns={rec.pronouns} schedule={rec.schedule} /></li>))
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