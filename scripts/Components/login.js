import { BackToHomeArrow } from './shared'
import { getFormDataByID, sendFormData, ShowError, SubmitLoginForm, SubmitSignupForm } from '../formsubmission'

function LoginBox() {
    return (
      <>
        <div className="centering-div">
          <div id="main-container-login">
              <h1 className="login-signup-title smooth-text">Login to your account</h1>
              <form id="loginform" className="login-signup-form" onSubmit={() => {event.preventDefault(); SubmitLoginForm()}}>
                  <input placeholder="Enter username" type="text" name="username" className="smooth-background"/>
                  <input placeholder="Enter password" type="password" name="password" className="smooth-background"/>
                  <button type="submit" className="smooth-background">Log in</button>
              </form>
              <h3>Don't have an account? <a className="orange-link smooth-text" href="signup.html">Sign up</a></h3>
          </div>
        </div>
      </>
    )
}

export function LoginPage() {
  return (
    <>
      <BackToHomeArrow />
      <LoginBox />
    </>
  )
}
