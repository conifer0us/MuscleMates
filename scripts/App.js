import { createRoot } from 'react-dom/client';

import { BackToHomeArrow, NavBar } from './Components/shared';
import { LoginPage } from './Components/login';
import { SignupPage } from './Components/signup';
import { HomePage } from './Components/homepage';
import { RecommendationsPage } from './Components/recommendations';
import { FriendsPage } from './Components/friends';
import { MatchRequestsPage } from './Components/matchrequests';
import { MyApp } from './Components/test';
import { MessagePage } from './Components/messages';

let path = window.location.pathname

const appDomNode = document.getElementById('app')
const appRoot = createRoot(appDomNode);

if (path == "/login.html") {
    appRoot.render(<LoginPage />)
}

if (path == "/signup.html") {
    appRoot.render(<SignupPage />)
}

if (path == "/home") {
    appRoot.render(<HomePage />)
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
    appRoot.render(<Index />)
}

if (path == "/messages") {
    appRoot.render(<MessagePage />)
}

// React Testing Homepage
if (path == "/") {
    appRoot.render(<MyApp />);
}
