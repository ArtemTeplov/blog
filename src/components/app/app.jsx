import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import API from '../../API/API';
import Header from '../header/header';
import ArticleList from '../articleList/articleList';
import Article from '../article/article';
import { Spin } from 'antd';

import classes from './app.module.scss';
import 'antd/dist/antd.css';

const App = () => {
  const [data, setData] = useState([]);
  const [totalArticles, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = () => {
    API.getArticles(page).then((result) => {
      setData(result.articles);
      setTotal(result.articlesCount);
      setLoading(false);
    });
  };
  const updatePage = (newpage) => {
    setPage(newpage);
    loadArticles();
  };

  const content = !loading ? (
    <ArticleList data={data} total={totalArticles} page={page} loggedIn={loggedIn} updatePage={updatePage} />
  ) : (
    <Spin size="large"/>
  );
  return (
    <div className={classes.wrapper}>
      <Router>
        <Header />
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
          <Route render={() => <h2 className={classes.not__found}>This page does not exist</h2>} />;
        </Switch>
      </Router>
    </div>
  );
};

export default App;