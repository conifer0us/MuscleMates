import { NavBar } from './shared'

export function ProfilePage() {
    return (
        <>
            <NavBar />

            <div class="wholepage">

                <div class="middlepage">

                    <div class="decorativerectangle"></div>

                    <div class="upperheaders">

                        <div class="headers">
                            <h1>Profile</h1>
                            <h2>Update your profile picture and personal detail</h2>
                        </div>

                        <div class="savebox">
                            <button class="button button:hover">Save</button>
                        </div>

                    </div>

                    <div class="userinfo">

                        <div class="input-and-button">
                            <div class="userinputs">
                                <input placeholder="Full Name" type="text" name="fullname" class="fullname-input" />
                                <input placeholder="Age" type="text" name="age" class="age-input" />
                                <input placeholder="Pronouns" type="text" name="pronouns" class="pronoun-input" />
                            </div>

                            <div class="genderbuttons">

                                <div class="genderbox">
                                    <div class="gender">
                                        <h4>Gender</h4>
                                    </div>

                                    <div class="radiobuttons">
                                        <input type="radio" name="gender" id="male" />
                                        <label for="male" class="radio">Male</label><br />
                                        <input type="radio" name="gender" id="female" />
                                        <label for="female" class="radio">Female</label><br />
                                        <input type="radio" name="gender" id="other" />
                                        <label for="other" class="radio">Other</label>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="bio">
                            <div class="rectanglebio">

                                <div class="biodes">
                                    <h4>Bio</h4>
                                    <h5>A short introduction of yourself</h5>
                                </div>

                                <div class="inputbox">
                                    <input placeholder="Your introduction" type="text" name="bio" class="bio-input" />
                                </div>

                            </div>
                        </div>

                        <div class="photo">
                            <div class="rectanglephoto">

                                <div class="photodes">
                                    <h4>Upload photo</h4>
                                    <h5>This photo will be displayed on your profile</h5>
                                </div>

                                <div class="uploadphoto">
                                    <div class="circle" name="photoupload"></div>
                                </div>

                                <div class="buttonbox">
                                    <button class="button1 button1:hover">Upload</button>
                                </div>

                                <div class="buttonbox">
                                    <button class="button1 button1:hover">Delete</button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}