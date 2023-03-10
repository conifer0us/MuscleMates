pagetitle = document.querySelector("title").innerHTML
console.log(pagetitle)

if (pagetitle == "Recommendations") {
    getRecsUsernames()
}

if (pagetitle == "Friends") {
    getFriendsUsernames()
}

if (pagetitle == "Match Requests") {
    getMatchesReceivedUsernames()
    getMatchesSentUsernames()
}

function sendMatchRequest(onsuccess) {
    fetch("SENDMATCHREQUESTURL")
    .then((response) => {
        if (response.status == 200) {
            alert("Request sent")
            onsuccess();
        }
        else {
            alert("Oops, something went wrong")
        }
    })
}

function acceptMatchRequest(onsuccess) {
    fetch("ACCEPTMATCHREQUESTURL")
    .then((response) => {
        if (response.status == 200) {
            alert("Match request accepted, you are now friends!")
            onsuccess();
        }
        else {
            alert("Something went wrong")
        }
    })
}

function cancelSentMatchRequest(onsuccess) {
    fetch("CANCELSENTMATCHREQUESTURL")
    .then((response) => {
        if (response.status == 200) {
            alert("Sent match request successfully cancelled")
        }
        else {
            alert("Something went wrong")
        }
    })
}

function getRecsUsernames() {
    fetch("/api/matchrecs")
    .then((response)=> {
        response.json().then((JSONData) => {
            nmatches = JSONData["matchrecs"].length
            for (i=0; i<nmatches; i++){
                getJSONData(JSONData["matchrecs"][i])
            }
        })
    })
}

function getFriendsUsernames() {
    fetch("/api/friends")
    .then((response) => {
        response.json().then((JSONData) => {
            nfriends = JSONData["friends"].length
            if (nfriends == 0) {
                nofriendsmessage = document.createElement("h3")
                nofriendsmessage.innerHTML = "No friends yet"
                friendspagecontainer = document.getElementById("friends-page-container")
                friendspagecontainer.append(nofriendsmessage)
            }
            for (i=0; i<nfriends; i++) {
                getJSONData(JSONData["friends"][i])
            }
        })
    })
}

function getMatchesReceivedUsernames() {
    fetch("/api/received")
    .then((response) => {
        response.json().then((JSONData) => {
            nreceived = JSONData["received"].length
            if (nreceived  == 0) {
                noreceivedmessage = document.createElement("h3")
                noreceivedmessage.innerHTML = "No match requests received"
                receivedmatchespagecontainer = document.getElementById("reqs-received-body")
                receivedmatchespagecontainer.append(noreceivedmessage)
            }
            for (i=0; i<nreceived; i++) {
                getJSONData(JSONData["received"][i], false)
            }
        })
    })
}

function getMatchesSentUsernames() {
    fetch("/api/sent")
    .then((response) => {
        response.json().then((JSONData) => {
            nsent = JSONData["send"].length
            console.log(nsent)
            if (nsent == 0) {
                nosentmessage = document.createElement("h3")
                nosentmessage.innerHTML = "No match requests sent"
                sentmatchespagecontainer = document.getElementById("reqs-sent-body")
                sentmatchespagecontainer.append(nosentmessage)
            }
            for (i=0; i<nsent; i++) {
                getJSONData(JSONData["send"][i], true)
            }
        })
    })
}

function getJSONData(username, sent) {
    fetch(`/api/profile/${username}`)
    .then((response) => {
        response.json().then((JSONData) => {
            addNewRecsDiv(JSONData["name"], username, JSONData["age"], JSONData["bio"], JSONData["gym"], sent);
        });
    })
}

function addNewRecsDiv(name, username, age, bio, gym, sent) {
    if (pagetitle == "Recommendations") {
        bodyofpage = document.getElementById("recs-page-container")
    }

    if (pagetitle == "Friends") {
        bodyofpage = document.getElementById("friends-page-container")
    }

    if ((pagetitle == "Match Requests") && sent == false) {
        bodyofpage = document.getElementById("reqs-received-body")
    }

    if ((pagetitle == "Match Requests") && sent == true) {
        bodyofpage = document.getElementById("reqs-sent-body")
    }

    const recommendation_container = document.createElement("div")
    recommendation_container.classList.add("recommendation-container")

    recommendation = document.createElement("div")

    if (pagetitle == "Recommendations") {
        recommendation.classList.add("recommendation")
        recommendation.addEventListener("click", () => {
            sendMatchRequest(()=>{recommendation_container.remove()});
        })
    }

    if (pagetitle == "Friends") {
        recommendation.classList.add("friend")
    }

    if (pagetitle == "Match Requests"  && sent == false) {
        recommendation.classList.add("accept-request")
        recommendation.addEventListener("click", () => {
            acceptMatchRequest(()=>{recommendation_container.remove()});
        })
    }

    if (pagetitle == "Match Requests"  && sent == true) {
        recommendation.classList.add("cancel-request")
        recommendation.addEventListener("click", () => {
            cancelSentMatchRequest(()=>{recommendation_container.remove()});
        })
    }
    
    const rec_info_container = document.createElement("div")

    if (pagetitle == "Recommendations" || pagetitle == "Match Requests" || pagetitle == "Friends") {
        rec_info_container.classList.add("rec-info-container")
    }

    if (pagetitle == "Recommendations") {
        arrow_send = document.createElement("span")
        arrow_send.classList.add("arrow-send")
        arrow_send.classList.add("material-symbols-outlined")
        arrow_send.innerHTML = "send"
    }

    if (pagetitle == "Match Requests" && sent == false) {
        arrow_send = document.createElement("span")
        arrow_send.classList.add("arrow-send")
        arrow_send.classList.add("material-symbols-outlined")
        arrow_send.innerHTML = "done"
    }

    if (pagetitle == "Match Requests" && sent == true) {
        arrow_send = document.createElement("span")
        arrow_send.classList.add("arrow-send")
        arrow_send.classList.add("material-symbols-outlined")
        arrow_send.innerHTML = "close"
    }

    const rec_profile_pic = document.createElement("div")
    rec_profile_pic.classList.add("rec-profile-pic")

    const rec_info = document.createElement("div")
    rec_info.classList.add("rec-info")

    const rec_info_parameters = document.createElement("div")
    rec_info_parameters.classList.add("rec-info-parameters")

    const rec_info_bio = document.createElement("div")
    rec_info_bio.classList.add("rec-info-bio")

    const rec_info_bio_text = document.createElement("p")
    rec_info_bio_text.classList.add("rec-info-bio-text")
    rec_info_bio_text.innerHTML = bio

    const rec_info_parameters_names = document.createElement("div")
    rec_info_parameters_names.classList.add("rec-info-parameters-names")

    const rec_info_parameters_fullname = document.createElement("div")
    rec_info_parameters_fullname.classList.add("rec-info-parameters-fullname")

    const rec_info_parameters_fullname_text = document.createElement("p")
    rec_info_parameters_fullname_text.classList.add("rec-info-parameters-fullname-text")
    rec_info_parameters_fullname_text.innerHTML = name

    const rec_info_parameters_username = document.createElement("div")
    rec_info_parameters_username.classList.add("rec-info-parameters-username")

    const rec_info_parameters_username_text = document.createElement("p")
    rec_info_parameters_username_text.classList.add("rec-info-parameters-username-text")
    rec_info_parameters_username_text.innerHTML = username

    const rec_info_parameters_days = document.createElement("div")
    rec_info_parameters_days.classList.add("rec-info-parameters-days")

    const rec_info_parameters_days_title = document.createElement("p")
    rec_info_parameters_days_title.classList.add("rec-info-parameters-title")
    rec_info_parameters_days_title.innerHTML = "Days: "

    const rec_info_parameters_seven_days = document.createElement("div")
    rec_info_parameters_seven_days.classList.add("rec-info-parameters-seven-days")

    const rec_info_parameters_seven_days_monday = document.createElement("p")
    rec_info_parameters_seven_days_monday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_monday.innerHTML = "M"

    const rec_info_parameters_seven_days_tuesday = document.createElement("p")
    rec_info_parameters_seven_days_tuesday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_tuesday.innerHTML = "T"

    const rec_info_parameters_seven_days_wednesday = document.createElement("p")
    rec_info_parameters_seven_days_wednesday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_wednesday.innerHTML = "W"

    const rec_info_parameters_seven_days_thursday = document.createElement("p")
    rec_info_parameters_seven_days_thursday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_thursday.innerHTML = "T"

    const rec_info_parameters_seven_days_friday = document.createElement("p")
    rec_info_parameters_seven_days_friday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_friday.innerHTML = "F"

    const rec_info_parameters_seven_days_saturday = document.createElement("p")
    rec_info_parameters_seven_days_saturday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_saturday.innerHTML = "S"

    const rec_info_parameters_seven_days_sunday = document.createElement("p")
    rec_info_parameters_seven_days_sunday.classList.add("rec-info-parameters-seven-days-day")
    rec_info_parameters_seven_days_sunday.innerHTML = "S"

    const rec_info_parameters_gym = document.createElement("div")
    rec_info_parameters_gym.classList.add("rec-info-parameters-gym")

    const rec_info_parameters_gym_title = document.createElement("p")
    rec_info_parameters_gym_title.classList.add("rec-info-parameters-title")
    rec_info_parameters_gym_title.innerHTML = "Gym: "

    const rec_info_parameters_gym_text = document.createElement("p")
    rec_info_parameters_gym_text.classList.add("rec-info-parameters-gym-text")
    rec_info_parameters_gym_text.innerHTML = gym

    const rec_info_parameters_age = document.createElement("div")
    rec_info_parameters_age.classList.add("rec-info-parameters-age")

    const rec_info_parameters_age_title = document.createElement("p")
    rec_info_parameters_age_title.classList.add("rec-info-parameters-title")
    rec_info_parameters_age_title.innerHTML = "Age: "

    const rec_info_parameters_age_text = document.createElement("p")
    rec_info_parameters_age_text.classList.add("rec-info-parameters-age-text")
    rec_info_parameters_age_text.innerHTML = age

    bodyofpage.append(recommendation_container)
    recommendation_container.append(recommendation)
    if (pagetitle == "Recommendations" || (pagetitle == "Match Requests")) {
        recommendation.append(rec_info_container, arrow_send)
    }
    if (pagetitle == "Friends") {
        recommendation.append(rec_info_container)
    }

    rec_info_container.append(rec_profile_pic)
    rec_info_container.append(rec_info)
    rec_info.append(rec_info_parameters, rec_info_bio)
    rec_info_bio.append(rec_info_bio_text)
    rec_info_parameters.append(rec_info_parameters_names, rec_info_parameters_days, rec_info_parameters_gym, rec_info_parameters_age)
    rec_info_parameters_names.append(rec_info_parameters_fullname, rec_info_parameters_username)
    rec_info_parameters_fullname.append(rec_info_parameters_fullname_text)
    rec_info_parameters_username.append(rec_info_parameters_username_text)
    rec_info_parameters_days.append(rec_info_parameters_days_title, rec_info_parameters_seven_days)
    rec_info_parameters_seven_days.append(rec_info_parameters_seven_days_monday, rec_info_parameters_seven_days_tuesday, rec_info_parameters_seven_days_wednesday, rec_info_parameters_seven_days_thursday, rec_info_parameters_seven_days_friday, rec_info_parameters_seven_days_saturday, rec_info_parameters_seven_days_sunday)
    rec_info_parameters_gym.append(rec_info_parameters_gym_title, rec_info_parameters_gym_text)
    rec_info_parameters_age.append(rec_info_parameters_age_title, rec_info_parameters_age_text)
}
