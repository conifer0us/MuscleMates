import { NavBar } from './shared'
import { useState, useEffect } from 'react'

function FriendDiv(username, fullname, gym, age, bio) {
    return (
      <div className="recommendation-container" username={username}>
        <a className="friend" href={"messages"} style={{textDecoration: 'none'}}>
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
            friendsinfolist.push({username: username, name: JSONData["name"], gym: JSONData["gym"], age: JSONData["age"], bio: JSONData["bio"]});
            setFriendsInfo(friendsinfolist.map((friend) => <li key={`${friend.username}-friend`}>{FriendDiv(friend.username, friend.name,  friend.gym, friend.age, friend.bio)}</li>))
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