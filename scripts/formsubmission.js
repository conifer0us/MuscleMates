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
function sendFormData(formid, url, errorstr) {
    // Turn Form Data into a URLSearchParams Object to Allow Normal Attribute Reference in Node
    let formdata = getFormDataByID(formid);
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
        else if (this.readyState == 4 && this.status == 401) {
            alert(errorstr);
        }
    }
    xhr.send(submitparams);
}

// Form Submission Function for Login Page
// Calls SendFormData for id "loginform", post page "/login.html", and error string "Login Failed"
function SubmitLoginForm() {
    sendFormData("loginform", "/login.html", "Login Failed");
}