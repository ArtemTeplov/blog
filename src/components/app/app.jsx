import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import API from '../../service/API';
import storage from '../../service/storage';

import Header from '../header/header';
import ArticleList from '../articleList/articleList';
import Article from '../article/article';
import SignUp from '../signUp/signUp';
import SignIn from '../signIn/signIn';
import Profile from '../profile/profile';

import { Spin } from 'antd';

import classes from './app.module.scss';
import 'antd/dist/antd.css';

const App = () => {
  const [data, setData] = useState([]);
  const [totalArticles, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    getLoggedUser();
  }, [loggedIn]);

  useEffect(() => {
    loadArticles(page);
  }, [userData, loggedIn, page]);

  const loadArticles = (page) => {
    API.getArticles(page).then((result) => {
      setData(result.articles);
      setTotal(result.articlesCount);
      setLoading(false);
    });
  };

  const updatePage = (newpage) => {
    setPage(newpage);
    loadArticles(newpage);
  };
  const loginSuccess = (user) => {
    console.log('loginSuccess, now logged in');
    setLoggedIn(true);
  };
  const getLoggedUser = () => {
    const token = storage.getFromStorage('token');
    if (token) {
      API.getCurrentUser(token).then((result) => {
        setUserData(result.user);
        setLoggedIn(true);
      });
    } else {
      setLoggedIn(false);
    }
  };
  const logOut = () => {
    localStorage.clear();
    getLoggedUser();
  };

  const content = !loading ? (
    <ArticleList data={data} total={totalArticles} page={page} loggedIn={loggedIn} updatePage={updatePage} />
  ) : (
    <Spin size='large' />
  );

  return (
    <div className={classes.wrapper}>
      <Router>
      <Header loggedIn={loggedIn} userData={userData} logOut={logOut} />
        <Switch>
          <Route path="/" render={() => content} exact />
          <Route path="/articles" render={() => content} exact />
          <Route
            path="/articles/:slug"
            render={({ match }) => {
              const slug = match.params.slug;
              return <Article slug={slug} data={data} loggedIn={loggedIn} />;
            }}
            exact
          />
          <Route path="/sign-up" component={SignUp} exact />;
          <Route path="/sign-in" render={() => <SignIn loginSuccess={loginSuccess} />} exact />;
          <Route
            path="/profile"
            render={() =>
              loggedIn ? (
                <Profile userData={userData} getLoggedUser={getLoggedUser} loggedIn={loggedIn} />
              ) : (
                <Redirect to="/sign-in" />
              )
            }
            exact
          />
          ;
          <Route render={() => <h2 className={classes.not__found}>This page does not exist</h2>} exact />;
        </Switch>
      </Router>
      </div>
  );
};

export default App;