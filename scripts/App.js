import { createRoot } from 'react-dom/client';
import { LoginPage } from './Components/login';
import { SignupPage } from './Components/signup';
import { RecommendationsPage } from './Components/recommendations';
import { FriendsPage } from './Components/friends';
import { MatchRequestsPage } from './Components/matchrequests';
import { MessagePage } from './Components/messages';
import { ProfilePage } from './Components/profile';
import { TrueHomePage } from './Components/truehomepage';

let path = window.location.pathname

const appDomNode = document.getElementById('app')
const appRoot = createRoot(appDomNode);

if (path == "/login.html") {
    appRoot.render(<LoginPage />)
}

if (path == "/signup.html") {
    appRoot.render(<SignupPage />)
}

if (path == "/profile") {
    appRoot.render(<ProfilePage />)
}

if (path == "/recommendations") {
    appRoot.render(<RecommendationsPage />)
}

if (path == "/matchrequests") {
    appRoot.render(<MatchRequestsPage />)
}

if (path == "/friends") {
    appRoot.render(<FriendsPage />)
}

if (path == "/index.html") {
    appRoot.render(<TrueHomePage />)
}

if (path.match("/messages/*/")) {
    appRoot.render(<MessagePage />)
}

if (path == "/" || path == "") {
    appRoot.render(<TrueHomePage />);
}
