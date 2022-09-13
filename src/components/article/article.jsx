import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory } from 'react-router-dom';
import { Popconfirm } from 'antd';

import API from '../../service/API';
import likeInactive from '../../assets/like_inactive.svg';
import likeActive from '../../assets/like_active.svg';

import { Spin } from 'antd';
import classes from './article.module.scss';

const Article = ({ slug, loggedIn, userData, loadArticles, addLike, removeLike, likes }) => {
  const [article, setArticle] = useState();
  const [loading, setLoading] = useState(true);
  let history = useHistory();

  useEffect(() => {
    if (loading) {
      loadArticle(slug);
    }
  }, [article, likes]);

  const loadArticle = (slug) => {
    API.getArticle(slug).then((result) => {
      setArticle(result.article);
      setLoading(false);
    });
  };
  const deleteOnclick = async () => {
    await API.deleteArticle(slug, userData.token).then((result) => {
      if (result) {
        loadArticles();
      }
    });
    setTimeout(() => history.push('/'), 300);
  };
  let tags;
  const handleLikeBtn = async () => {
    if (!likes.includes(slug)) {
      await API.favoriteArticle(slug, userData.token).then((result) => {
        addLike(slug);
        loadArticle(slug);
      });
    } else {
      await API.unFavoriteArticle(slug, userData.token).then((result) => {
        removeLike(slug);
        loadArticle(slug);
      });
    }
    loadArticles();
  };
  if (article !== undefined) {
    if (article.tagList.length > 0) {
      tags = article.tagList.map((item, idx) => {
        return (
          <button key={idx} className={classes.article__tag}>
            {item}
          </button>
        );
      });
    }
    const likeImg = likes.includes(slug) ? likeActive : likeInactive;
    const articleControls = () => {
      const text = 'Are you sure to delete this article?';
      if (loggedIn && userData.username === article.author.username) {
        return (
          <div className={classes.article__controls}>
            <Popconfirm placement="rightTop" title={text} onConfirm={deleteOnclick} okText="Yes" cancelText="No">
              <button className={classes.article__btn_delete}>Delete</button>
            </Popconfirm>

            <Link to={`/articles/${slug}/edit`}>
              <button className={classes.article__btn_edit}>Edit</button>
            </Link>
          </div>
        );
      }
    };
    return (
      <div className={classes.wrapper}>
        <div className={classes.article}>
          <div className={classes.article__header}>
            <div className={classes.article__info}>
              <div className={classes.article__data}>
                <h5 className={classes.article__title}>{article.title}</h5>
                <button className={classes.article__likeBtn} onClick={handleLikeBtn} disabled={!loggedIn}>
                  <img src={likeImg} alt="like"></img>
                  <span className={classes.article__likes}>{article.favoritesCount}</span>
                </button>
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
          <div className={classes.article__container}>
            <p className={classes.article__descr}>{article.description}</p>
            {articleControls()}
          </div>
          <div className={classes.article__descr}>
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return <Spin size='large' />;
};
export default Article;