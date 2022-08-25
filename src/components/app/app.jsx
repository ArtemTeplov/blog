import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import API from '../../service/API';
import storage from '../../service/storage';
import Header from '../header/header';
import ArticleList from '../articleList/articleList';
import Article from '../article/article';

import SignUp from '../signUp/signUp';
import SignIn from '../signIn/signIn';
import Profile from '../profile/profile';
import NewArticle from '../newArticle/newArticle';
import EditArticle from '../editArticle/editArticle';
import PrivateRoute from '../privateRoute/privateRoute';

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
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    getLoggedUser();
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const likes = JSON.parse(storage.getFromStorage('likes'));
      if (likes) {
        setLikes(likes);
      }
    }
  }, [loggedIn]);

  useEffect(() => {
    loadArticles(page);
    setLoading(false);
  }, [userData, loggedIn, page]);

  const loadArticles = (page) => {
    API.getArticles(page).then((result) => {
      setData(result.articles);
      setTotal(result.articlesCount);
    });
  };
  const updatePage = (newpage) => {
    setPage(newpage);
    loadArticles(newpage);
  };
  const loginSuccess = (user) => {
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

  const addLike = (id) => {
    const likes = JSON.parse(storage.getFromStorage('likes'));
    if (likes) {
      const newLikes = likes.slice(0);
      newLikes.push(id);
      storage.setToStorage('likes', JSON.stringify(newLikes));
      setLikes(newLikes);
    } else {
      storage.setToStorage('likes', JSON.stringify([id]));
      setLikes([id]);
    }
  };
  const removeLike = (id) => {
    const likes = JSON.parse(storage.getFromStorage('likes'));
    if (likes) {
      const newLikes = likes.slice(0);
      const idx = newLikes.findIndex((el) => el === id);
      const newArray = [...newLikes.slice(0, idx), ...newLikes.slice(idx + 1)];
      storage.setToStorage('likes', JSON.stringify(newArray));
      setLikes(newArray);
    } else {
      storage.setToStorage('likes', JSON.stringify([]));
      setLikes([]);
    }
  };
  const logOut = () => {
    storage.setToStorage('token', '');
    getLoggedUser();
    setLoggedIn(false);
    setLikes([]);
  };
  const content = loading ? (
    <Spin size='large' />
  ) : (
    <ArticleList
      data={data}
      total={totalArticles}
      page={page}
      userData={userData}
      loggedIn={loggedIn}
      updatePage={updatePage}
      addLike={addLike}
      likes={likes}
      removeLike={removeLike}
      loadArticles={() => loadArticles(page)}
    />
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
              return (
                <Article
                  slug={slug}
                  data={data}
                  loggedIn={loggedIn}
                  userData={userData}
                  loadArticles={() => loadArticles(page)}
                  addLike={addLike}
                  likes={likes}
                  removeLike={removeLike}
                />
              );
            }}
            exact
          />
          <Route
            path="/articles/:slug/edit"
            render={({ match }) => {
              const slug = match.params.slug;
              return <EditArticle slug={slug} loadArticles={() => loadArticles(page)} userData={userData} />;
            }}
            exact
          />
          ;
          <Route path="/sign-up" component={SignUp} exact />;
          <Route path="/sign-in" render={() => <SignIn loginSuccess={loginSuccess} />} exact />;
          <PrivateRoute path="/profile" loggedIn={loggedIn}>
            <Profile userData={userData} getLoggedUser={getLoggedUser} />
          </PrivateRoute>
          ;
          <PrivateRoute path="/new-article" loggedIn={loggedIn}>
            <NewArticle loadArticles={() => loadArticles(page)} userData={userData} />
          </PrivateRoute>
          ;
          <Route render={() => <h2 className={classes.not__found}>This page does not exist</h2>} exact />;
        </Switch>
      </Router>
    </div>
  );
};

export default App;