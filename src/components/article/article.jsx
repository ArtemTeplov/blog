import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import ReactMarkdown from 'react-markdown';

import { Spin } from 'antd';
import API from '../../API/API';
import likeInactive from '../../assets/like_inactive.svg';
import likeActive from '../../assets/like_active.svg';

import classes from './article.module.scss';

const Article = ({ slug, loggedIn }) => {
  const [article, setArticle] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      loadArticle(slug);
    }
  }, [article]);

  const loadArticle = async (slug) => {
    await API.getArticle(slug).then((result) => {
      setArticle(result.article);
      setLoading(false);
    });
  };
  let tags;
  if (article !== undefined) {
    console.log('loaded');
    if (article.tagList.length > 0) {
      tags = article.tagList.map((item, idx) => {
        return (
          <button key={idx} className={classes.article__tag}>
            {item}
          </button>
        );
      });
    }
    const like = article.favorited && loggedIn ? likeActive : likeInactive;
    return (
      <div className={classes.wrapper}>
        <div className={classes.article}>
          <div className={classes.article__header}>
            <div className={classes.article__info}>
              <div className={classes.article__data}>
                <h5 className={classes.article__title}>{article.title}</h5>
                <button className={classes.article__likeBtn} onClick={() => console.log('like')}>
                  <img src={like} alt="like"></img>
                </button>
                <span className={classes.article__likes}>{article.favoritesCount}</span>
              </div>
              <div className={classes.article__tags}>{tags}</div>
            </div>
            <div className={classes.article__author}>
              <div>
                <h6 className={classes.article__name}>{article.author.username}</h6>
                <span className={classes.article__date}>{format(new Date(article.createdAt), 'MMMM d, y')}</span>
              </div>
              <img className={classes.article__avatar} src={article.author.image} alt="author avatar"></img>
            </div>
          </div>
          <div className={classes.article__descr}>
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return <Spin />;
};
export default Article;