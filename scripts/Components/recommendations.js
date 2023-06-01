import { NavBar } from './shared';
import { useState, useEffect } from 'react';
import { loadImageToTag } from '../formsubmission';

export function RecommendationDiv(props) {

    const {username, fullname, gym, age, bio, pronouns, schedule} = props;

    const [dumbthing2, setdumbthing2] = useState(0);

    useEffect(() => {
      loadImageToTag(document.getElementById(`img_${username}`), username);
    }, []);

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
      });
    }
  
    return (
      <>
      <div className="recommendation-container" username={username}>
        <div className="recommendation" onClick={() => sendMatchRequest(username)}>
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
              <span className="arrow-send material-symbols-outlined">send</span>
          </div>
      </div>
      </>
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
                recsinfolist.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"], pronouns: JSONData["pronouns"], schedule: JSONData["schedule"]})
                setInfoList(recsinfolist.map((rec) => <li key={`${rec.username}-recommendation`}><RecommendationDiv username={rec.username} fullname={rec.name} gym={rec.gym} age={rec.age} bio={rec.bio} pronouns={rec.pronouns} schedule={rec.schedule} /></li>))
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