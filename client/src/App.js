import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import DashBoard from './components/DashBoard/DashBoard';
import PrivateRoute from './components/Routing/PrivateRoute';
import CreateProfile from './components/Profile-Form/CreateProfile';
import EditProfile from './components/Profile-Form/EditProfile';
import AddExperience from './components/Profile-Form/AddExperience';
import AddEducation from './components/Profile-Form/AddEducation';
import Profile from './components/Profile/Profile';
import Posts from './components/Posts/Posts';
import Post from './components/Post/Post';
//redux
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './Untils/setAuthToken';
import Profiles from './components/profiles/Profiles';
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section className='container'>
            <Alert />
          </section>

          <Switch>
            <Route exact path='/' component={Landing} />
            <section className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:id' component={Profile} />
              <PrivateRoute exact path='/dashboard' component={DashBoard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
              <PrivateRoute exact path='/posts' component={Posts} />
              <PrivateRoute exact path='/posts/:id' component={Post} />
            </section>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
