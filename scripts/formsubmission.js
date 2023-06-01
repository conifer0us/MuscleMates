// Contains Scripts to Handle Form Submission Events

const workouttypes = ["weightlifting", "calisthenics", "cycling", "running", "walking", "swimming",
    "rowing", "yoga", "dance", "crossfit", "powerlifting", "squash", "soccer", "basketball", "hiit"];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const colors = ["aqua", "aquamarine", "blueviolet", "chartreuse", "coral", "cornflowerblue", "darkcyan", "deeppink", "darkorchid"]

// Returns FormData Element for a Given FormID in the current page 
function getFormDataByID(formid) {
    let formelement = document.getElementById(formid);
    let formdata = new FormData(formelement);
    return formdata;
}

function getColorForUsername(uname = "") {
    let h = 0;
    for(let i = 0; i < uname.length; i++)
        h = Math.imul(31, h) + uname.charCodeAt(i) | 0;

    let hashString = ((h < 0) ? (-1 * h) : h) % colors.length;

    return colors[hashString];
}

export async function loadImageToTag(imgelem, username) {
    let profimage = await fetch(`/profimage/user/${username}`);
    let imagedata;
    if (profimage.status == 200) {
        imagedata = URL.createObjectURL(await profimage.blob());

        imgelem.setAttribute("src", imagedata);
        return;
    }

    imgelem.style.display = "none";
    imgelem.parentElement.style.backgroundColor = getColorForUsername(username);
}

// Sends An HTTP Post Request to the supplied URL with the formdata in the form specified by formid
// Redirects to Proper Page if Send 301 Status Code (Successful Login)
// Shows Alert with errorstr if login denied
function sendFormData(formdata, url, errorstr) {
    // Turn Form Data into a URLSearchParams Object to Allow Normal Attribute Reference in Node
    let submitparams = new URLSearchParams();
    for (const [formkey, formval] of formdata.entries()) {
        submitparams.append(formkey, formval);
    }

    // Sets Up Requests and Sends Request with Listener for Completion
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {

        // If Server Responds with Confirmation, redirect to Server-Supplied URL
        if (this.readyState == 4 && this.status == 200) {
            location.assign(xhr.responseURL);
        }

        // If Error in Login, Alert User with Supplied Error String
        else if (this.readyState == 4 && (this.status < 500 && this.status > 399)) {
            ShowError(errorstr);
        }
    }
    xhr.send(submitparams);
}

// Shows an Error if Something Goes Wrong in Form Submission
function ShowError(errorstr) {
    alert(errorstr);
}

// Form Submission Function for Login Page
// Calls SendFormData for id "loginform", post page "/login.html", and error string "Login Failed"
export const SubmitLoginForm = function SubmitLoginForm() {
    sendFormData(getFormDataByID("loginform"), "/login.html", "Login Failed");
}

// Form Submission Function for Signup Page
export const SubmitSignupForm = function SubmitSignupForm() {
    const SignupFormData = getFormDataByID("signupform");

    // Get Individual Elements of Form to Validate
    const emaildata = SignupFormData.get("email");
    const uname = SignupFormData.get("username");
    const password = SignupFormData.get("password")
    const repeatpassword = SignupFormData.get("repeatpassword")

    if (!emaildata || !uname || !password || !repeatpassword) {
        ShowError("Not All Field Values Set");
    }

    // Validates Email with Regex
    else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emaildata))) {
        ShowError("Invalid Email Address");
    }

    // Checks if Password and Repeat Password are not the Same
    else if (password != repeatpassword) {
        ShowError("Passwords Do Not Match")
    }

    // Checks if Password is Fewer than 8 Characters
    else if (password.length < 8) {
        ShowError("Password Must be More than 8 Characters")
    }

    // Send Signup Request to Server if Conditions Met
    else {
        sendFormData(SignupFormData, "/signup.html", "Username or Email Already Exists")
    }
}

export const SubmitProfileForm = async () => {
    let formdata = getFormDataByID("profileform");

    if (!formdata.get("name") || !formdata.get("bio") || !formdata.get("age") || !formdata.get("gender") || !formdata.get("gym")) {
        ShowError("Please fill out all required information.");
        return;
    }

    // Do Not Set Name to Steve Earth, David Min, or Tammy Pirmann. You have been warned.
    if (formdata.get("name") == "Steve Earth" || formdata.get("name") == "Tammy Pirmann" || formdata.get("name") == "David Min") {
        window.location.href = "https://media.tenor.com/GCMl-Z0DIl4AAAAd/bowser-fart.gif";
        return;
    }

    if (!/^[0-9]{2}$/.test(formdata.get("age"))) {
        ShowError("Please Enter a Valid Age");
    }

    if (!formdata.get("pronouns")) {
        formdata.set("pronouns", "");
    }

    if (document.getElementById("male").checked) {
        formdata.set("gender", "male");
    } else if (document.getElementById("female").checked) {
        formdata.set("gender", "female");
    } else { formdata.set("gender", "other") }

    formdata.set("filterByGym", (formdata.get("filterByGym") ? "1" : "0"));

    formdata.set("filterByGender", (formdata.get("filterByGender") ? "1" : "0"));

    let workoutstring = "";

    for (const workout of workouttypes) {
        if (document.getElementById(workout).checked) {
            workoutstring += "1";
        } else {
            workoutstring += "0";
        }
    }

    let schedule = "";

    for (const day of days) {
        if (document.getElementById(day).checked) {
            schedule += "1";
        } else {
            schedule += "0";
        }
    }

    formdata.set("workout", workoutstring);
    formdata.set("schedule", schedule);

    const profupdate = await fetch("/submit/profile", {
        method: "POST",
        body: formdata
    });

    if (profupdate.status != 200) {
        ShowError("There was a problem with updating your profile.")
        return;
    }

    const prefupdate = await fetch("/submit/preferences", {
        method: "POST",
        body: formdata
    });

    if (prefupdate.status != 200) {
        ShowError("There was a problem updating your preferences")
        return;
    }

    if (/^image\//.test(formdata.get("profimage").type)) {
        const imgupload = await fetch("/profimage/upload", {
            method: "POST", 
            body: formdata
        });

        if (imgupload.status != 200) {
            ShowError("There was a problem updating your profile image.");
            return;
        }
    }

    alert("Profile successfully updated.");
}

export const importProfileData = async () => {
    const unameres = await fetch("/api/myusername");
    const username = (await unameres.text()).replaceAll('"', '');
    console.log(`🍓🍓Hi ${username}!🍓🍓`);

    const profres = await fetch(`/api/profile/${username}`);
    if (profres.status != 200) {
        console.log("No profile found yet.");
        document.getElementById("detailtext").innerHTML = "Create a Profile so you can Match and Make Friends!";
        return;
    }

    let profinfo = await profres.json();
    console.log(profinfo);

    if (profinfo["name"]) {
        document.getElementById("name").value = profinfo["name"];
    }

    if (profinfo["age"]) {
        document.getElementById("age").value = profinfo["age"];
    }

    if (profinfo["bio"]) {
        document.getElementById("bio").value = profinfo["bio"];
    }

    if (profinfo["pronouns"]) {
        document.getElementById("pronouns").value = profinfo["pronouns"];
    }

    if (profinfo["gym"]) {
        document.getElementById("gym-name").value = profinfo["gym"];
    }

    switch (profinfo["gender"]) {
        case "male":
            document.getElementById("male").click();
            break;
        case "female":
            document.getElementById("female").click();
            break;
        case "other":
            document.getElementById("other").click();
            break;
    }

    if (profinfo["gymfilter"]) {
        document.getElementById("gym-filter").click();
    }

    if (profinfo["genderfilter"]) {
        document.getElementById("gender-filter").click();
    }

    if (profinfo["schedule"].length == days.length) {
        for (let i = 0; i < days.length; i++) {
            if (profinfo["schedule"][i] == "1") {
                document.getElementById(days[i]).click();
            }
        }
    }

    if (profinfo["workout"].length == workouttypes.length) {
        for (let i = 0; i < workouttypes.length; i++) {
            if (profinfo["workout"][i] == "1") {
                document.getElementById(workouttypes[i]).click();
            }
        }
    }

    let profimage = await fetch(`/profimage/user/${username}`);
    let imagedata;
    if (profimage.status == 200) {
        imagedata = URL.createObjectURL(await profimage.blob());

        document.getElementById("profimage").setAttribute("src", imagedata);
        document.getElementById("profimage").style.width = "100%";
        document.getElementById("profimage").style.width = "100%";
        document.getElementById("profimagecircle").style.backgroundColor = "transparent";
        return;
    }

    console.log("No Profile Image Set. Loading Backup.");
    profimage = await fetch(`/profimage/default/`);
    imagedata = URL.createObjectURL(await profimage.blob());
    document.getElementById("profimage").setAttribute("src", imagedata);
}

export const uploadimg = async () => {
    document.getElementById("photo-input").click();
}

export const processimg = async (event) => {
    let fr = new FileReader();

    fr.readAsDataURL(event.target.files[0]);

    fr.onload = () => {
        let imgdata = fr.result;

        document.getElementById("profimage").setAttribute("src", imgdata);
        document.getElementById("profimage").style.width = "100%";
        document.getElementById("profimage").style.width = "100%";
        document.getElementById("profimagecircle").style.backgroundColor = "transparent";
    }
}

export const logout = () => {
    document.cookie = "AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
}