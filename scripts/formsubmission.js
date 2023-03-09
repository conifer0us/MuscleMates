// Contains Scripts to Handle Form Submission Events

// Returns FormData Element for a Given FormID in the current page 
function getFormDataByID(formid) {
    let formelement = document.getElementById(formid);
    let formdata = new FormData(formelement);
    return formdata;
}

// Sends An HTTP Post Request to the supplied URL with the formdata in the form specified by formid
// Redirects to Proper Page if Send 301 Status Code (Successful Login)
// Shows Alert with errorstr if login denied
function sendFormData(formdata, url, errorstr) {
    // Turn Form Data into a URLSearchParams Object to Allow Normal Attribute Reference in Node
    submitparams = new URLSearchParams();
    for (const [formkey, formval] of formdata.entries()) {
        submitparams.append(formkey, formval);
    }

    // Sets Up Requests and Sends Request with Listener for Completion
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {

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
function SubmitLoginForm() {
    sendFormData(getFormDataByID("loginform"), "/login.html", "Login Failed");
}

// Form Submission Function for Signup Page
function SubmitSignupForm() {
    const SignupFormData = getFormDataByID("signupform");
    
    // Get Individual Elements of Form to Validate
    const emaildata = SignupFormData.get("email");
    const uname = SignupFormData.get("username");
    const password = SignupFormData.get("password")
    const repeatpassword = SignupFormData.get("repeatpassword")

    // 
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

