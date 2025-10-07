import Login from '../pages/Login';
import LoginOld from '../pages/Login_old';
import SignIn from '../pages/SignIn';
// import Manual from '../pages/Manual';

export const publicRoutes = [
	{ name: 'login', path: '/login', component: Login },
	{ name: 'login_old', path: '/login_old', component: LoginOld },
	{ name: 'signIn', path: '/sign-in', component: SignIn },

];
