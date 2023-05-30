import { BackArrow } from './shared'
import { getFormDataByID, sendFormData, ShowError, SubmitProfileForm } from '../formsubmission'

export function ProfilePage() {
    return (
        <form id="profileform" className="profile-form" onSubmit={() => {event.preventDefault(); SubmitProfileForm()}}>
            <div className="wholepage">
                <BackArrow />
                <div className="middlepage">
                    <div className="upperheaders">
                        <div className="headers">
                            <h1 className="profile-h1">Profile</h1>
                        </div>
                        <div className="savebox">
                            <button type='submit' className="button smooth-background">Save</button>
                        </div>
                    </div>
                    <div className="userinfo">
                        <div className="input-and-button">
                            <div className="userinputs">
                                <input placeholder="Full Name" type="text" name="fullname" className="info-input" />
                                <input placeholder="Age" type="text" name="age" className="info-input" />
                                <input placeholder="Pronouns" type="text" name="pronouns" className="info-input" />
                            </div>
                            <div className="genderbuttons">
                                <div className="genderbox">
                                    <div className="gender">
                                        <h4 className="profile-h4">Gender</h4>
                                    </div>
                                    <div className="radiobuttons">
                                        <input type="radio" name="gender" id="male" className="input-item" />
                                        <label htmlFor="male" className="input-label">Male</label><br />
                                        <input type="radio" name="gender" id="female" className="input-item" />
                                        <label htmlFor="female" className="input-label">Female</label><br />
                                        <input type="radio" name="gender" id="other" className="input-item" />
                                        <label htmlFor="other" className="input-label">Other</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bio">
                            <div className="rectangle2">
                                <div className="biodes">
                                    <h4 className="profile-h4">Bio</h4>
                                    <h5 className="profile-h5">A short introduction of yourself</h5>
                                </div>
                                <div className="inputbox">
                                    <textarea placeholder="Your introduction" type="textarea" name="bio" className="bio-input" rows="4" />
                                </div>
                            </div>
                        </div>
                        <div className="photo">
                            <div className="rectangle2">
                                <div className="photodes">
                                    <h4 className="profile-h4">Upload photo</h4>
                                    <h5 className="profile-h5">This photo will be displayed on your profile</h5>
                                </div>
                                <div className="uploadphoto">
                                    <div className="circle" name="photoupload"></div>
                                </div>
                                <div className="buttonbox">
                                    <button className="smooth-background">Upload</button>
                                </div>
                                <div className="buttonbox">
                                    <button className="smooth-background">Delete</button>
                                </div>
                            </div>
                        </div>
                        <div className="rectangle2">
                            <h4 className='profile-h4'>Workout Types</h4>
                            <div className='checkbox-list-workout'>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='weightlifting' className="input-item"></input>
                                    <label htmlFor='weightlifting' className="input-label">Weightlifting</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='calisthenics' className="input-item"></input>
                                    <label htmlFor='calisthenics' className="input-label">Calisthenics</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='cycling' className="input-item"></input>
                                    <label htmlFor='cycling' className="input-label">Cycling</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='running' className="input-item"></input>
                                    <label htmlFor='running' className="input-label">Running</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='walking' className="input-item"></input>
                                    <label htmlFor='walking' className="input-label">Walking</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='swimming' className="input-item"></input>
                                    <label htmlFor='swimming' className="input-label">Swimming</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='rowing' className="input-item"></input>
                                    <label htmlFor='rowing' className="input-label">Rowing</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='yoga' className="input-item"></input>
                                    <label htmlFor='yoga' className="input-label">Yoga</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='dance' className="input-item"></input>
                                    <label htmlFor='dance' className="input-label">Dance</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='crossfit' className="input-item"></input>
                                    <label htmlFor='crossfit' className="input-label">Crossfit</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='powerlifting' className="input-item"></input>
                                    <label htmlFor='powerlifting' className="input-label">Powerlifting</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='squash' className="input-item"></input>
                                    <label htmlFor='squash' className="input-label">Squash</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='soccer' className="input-item"></input>
                                    <label htmlFor='soccer' className="input-label">Soccer</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='basketball' className="input-item"></input>
                                    <label htmlFor='basketball' className="input-label">Basketball</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='hiit' className="input-item"></input>
                                    <label htmlFor='hiit' className="input-label">HIIT</label>
                                </div>
                            </div>
                        </div>
                        <div className="rectangle2">
                            <h4 className='profile-h4'>Gym and Filters</h4>
                            <input id='gym-name' placeholder='Gym name' className='gym-input' />
                            <div className='checkbox-list'>
                                <div className='checkbox-item-filter'>
                                    <input type='checkbox' id='gym-filter' className="input-item"></input>
                                    <label htmlFor='gym-filter' className="input-label">Filter Recommendations by Gym</label>
                                </div>
                                <div className='checkbox-item-filter'>
                                    <input type='checkbox' id='gender-filter' className="input-item"></input>
                                    <label htmlFor='gender-filter' className="input-label">Filter Recommendations by Gender</label>
                                </div>
                            </div>
                        </div>
                        <div className="rectangle2" id='daysoftheweek'>
                            <h4 className='profile-h4'>Days of the Week</h4>
                            <div className='checkbox-list'>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='monday' className="input-item"></input>
                                    <label htmlFor='monday' className="input-label">Monday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='tuesday' className="input-item"></input>
                                    <label htmlFor='tuesday' className="input-label">Tuesday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='wednesday' className="input-item"></input>
                                    <label htmlFor='wednesday' className="input-label">Wednesday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='thursday' className="input-item"></input>
                                    <label htmlFor='thursday' className="input-label">Thursday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='friday' className="input-item"></input>
                                    <label htmlFor='friday' className="input-label">Friday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='saturday' className="input-item"></input>
                                    <label htmlFor='saturday' className="input-label">Saturday</label>
                                </div>
                                <div className='checkbox-item'>
                                    <input type='checkbox' id='sunday' className="input-item"></input>
                                    <label htmlFor='sunday' className="input-label">Sunday</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}