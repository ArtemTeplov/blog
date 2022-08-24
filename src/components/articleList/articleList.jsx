import React from 'react';
import { Pagination } from 'antd';

import ArticleShort from '../articleShort/articleShort';

import classes from './articleList.module.scss';

const ArticleList = ({ data, total, page, loggedIn, updatePage }) => {
  const articles = data.map((item) => {
    return <ArticleShort key={item.slug} data={item} loggedIn={loggedIn} />;
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