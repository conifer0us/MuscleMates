import { NavBar } from './shared'
import { useState, useEffect } from 'react'

function RecommendationDiv(username, fullname, gym, age, bio) {

    function sendMatchRequest(username) {
      console.log("Sending request for ", username);
      fetch("/submit/sendreq/"+username, {method:"POST"})
      .then((response) => {
          if (response.status == 200) {
              alert("Request sent")
              document.querySelector(`div[username=${username}]`).closest("li").remove()
          }
          else {
              alert("Oops, something went wrong")
          }
      })
    }
  
    return (
      <div className="recommendation-container" username={username}>
        <div className="recommendation" onClick={() => sendMatchRequest(username)}>
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
              <span className="arrow-send material-symbols-outlined">send</span>
          </div>
      </div>
    )
}
  
export function RecommendationsPage() {
  
    let recsinfolist = []
  
    const [recsinfo, setInfoList] = useState([])
  
    useEffect(() => {
      getRecsUsernames();
    }, [])
  
    function getRecsUsernames() {
      fetch("/api/matchrecs").then((response) => {
        response.json().then((JSONData) => {
          let nrecs = JSONData["matchrecs"].length
          if (nrecs == 0) {
            setInfoList(<h3>There are no recommendations available</h3>)
          }
          for (let i=0;i<JSONData["matchrecs"].length;i++) {
            let username = JSONData["matchrecs"][i]
            fetch(`/api/profile/${username}`).then((response) => {
              response.json().then((JSONData) => {
                recsinfolist.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"]})
                setInfoList(recsinfolist.map((rec) => <li key={`${rec.username}-recommendation`}>{RecommendationDiv(rec.username, rec.name, rec.age, rec.gym, rec.bio)}</li>))
              })
            })
          }
        })
      })
    }
  
    return (
      <>
        <NavBar />
        <div className='recs-title-link-div'>
          <h1 className='tab'>Recommendations</h1>
          <h2><a href="matchrequests" className="orange-link">Manage Requests</a></h2>
        </div>
        <div className='tab'>
          <ul>{recsinfo}</ul>
        </div>
      </>
    )
}