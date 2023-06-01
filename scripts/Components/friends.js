import { NavBar } from './shared'
import { useState, useEffect } from 'react'
import { loadImageToTag } from '../formsubmission'

function FriendDiv(props) {

  const {username, fullname, gym, age, bio, pronouns, schedule} = props;

  const [dumbthing2, setdumbthing2] = useState(0);

  useEffect(() => {
    loadImageToTag(document.getElementById(`img_${username}`), username);
  }, []);

    return (
      <div className="recommendation-container" username={username}>
        <a className="friend" href={`/messages/${username}/`} style={{textDecoration: 'none'}}>
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
              <span className="arrow-send material-symbols-outlined">forum</span>
          </a>
      </div>
    )
}

export function FriendsPage() {
  let friendslist = []
  let friendsinfolist = []

  const [friendsinfo, setFriendsInfo] = useState([])

  useEffect(() => {
    getFriendsUsername();
  }, [])

  function getFriendsUsername() {
    fetch("/api/friends")
    .then((response) => {
        response.json().then((JSONData) => {
          let nfriends = JSONData["friends"].length
          if (nfriends == 0) {
            setFriendsInfo(<h3>You currently don't have any friends</h3>)
          }
          for(let i=0;i<JSONData["friends"].length;i++) {
            friendslist.push(JSONData["friends"][i])
            getJSONData(JSONData["friends"][i])
          }
        })
    })
  }

  function getJSONData(username) {
    fetch(`/api/profile/${username}`)
    .then((response) => {
        response.json().then((JSONData) => {
            friendsinfolist.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"], pronouns: JSONData["pronouns"], schedule: JSONData["schedule"]});
            setFriendsInfo(friendsinfolist.map((friend) => <li key={`${friend.username}-friend`}><FriendDiv username={friend.username} fullname={friend.name} gym={friend.gym} age={friend.age} bio={friend.bio} pronouns={friend.pronouns} schedule={friend.schedule}/></li>))
        });
    })
  }

  return (
  <>
    <NavBar />
    <div className='tab'>
      <h1>Friends</h1>
      <ul>{friendsinfo}</ul>
    </div>
  </>)
}