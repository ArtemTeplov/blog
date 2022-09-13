import React from 'react';
import { Pagination } from 'antd';

import ArticleShort from '../articleShort/articleShort';

import classes from './articleList.module.scss';

const ArticleList = ({
  data,
  total,
  userData,
  page,
  loggedIn,
  updatePage,
  likes,
  addLike,
  removeLike,
  loadArticles,
}) => {
  const articles = data.map((item) => {
    return (
      <ArticleShort
        key={item.slug}
        data={item}
        loggedIn={loggedIn}
        likes={likes}
        addLike={addLike}
        removeLike={removeLike}
        userData={userData}
        loadArticles={loadArticles}
      />
    );
  });
  return (
    <div className={classes.list}>
      {articles}
      <Pagination
        defaultCurrent={1}
        current={page}
        total={total}
        pageSize={5}
        responsive
        showSizeChanger={false}
        onChange={(e) => updatePage(e)}
      />
    </div>
  );
};

export default ArticleList;