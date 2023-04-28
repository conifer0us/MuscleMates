import { BackToHomeArrow } from './shared'
import { getFormDataByID, sendFormData, ShowError, SubmitLoginForm, SubmitSignupForm } from '../formsubmission'

function SignupBox() {
    return (
      <>
        <div className="centering-div">
            <div id="main-container-signup">
                <h1 className="login-signup-title">Create a new account</h1>
                <form className="login-signup-form" id="signupform" onSubmit= {() => {event.preventDefault(); SubmitSignupForm();}}>
                    <input placeholder="E-mail address" type="text" name="email" className="smooth-background"/>
                    <input placeholder="Username" type="text" name="username" className="smooth-background"/>
                    <input placeholder ="Password" type="password" name="password" className="smooth-background"/>
                    <input placeholder="Confirm password" type="password" name="repeatpassword" className="smooth-background"/>
                    <button className="smooth-background">Sign up</button>
                </form>
                <h3>Already have an account? <a className="orange-link smooth-text" href="login.html">Log in</a></h3>
            </div>
        </div>
      </>
    )
}
  
export function SignupPage() {
    return (
      <>
        <BackToHomeArrow />
        <SignupBox /> 
      </>
    )
}
