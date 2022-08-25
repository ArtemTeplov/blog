import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Spin } from 'antd';
import API from '../../service/API';

import classes from './editArticle.module.scss';

const EditArticle = ({ slug, loadArticles, userData }) => {
  let history = useHistory();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (loading) {
      loadArticle(slug);
    }
  }, []);
  useEffect(() => {
    reset(article);
  }, [article]);

  const loadArticle = (slug) => {
    API.getArticle(slug).then((result) => {
      setArticle(result.article);
      setLoading(false);
      setTags(result.article.tagList);
    });
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return article;
    }, [article]),
  });
  const checkAddedTags = () => {
    if (tags.length !== 0) {
      return tags.map((item) => {
        return (
          <div key={item}>
            <input disabled className={classes.editArticle__input} value={item}></input>
            <button className={classes.editArticle__btn_delete} onClick={(e) => handleTagDelete(e, item)}>
              Delete tag
            </button>
          </div>
        );
      });
    }
  };
  const handleTagDelete = (e, item) => {
    e.preventDefault();
    const idx = tags.findIndex((el) => el === item);
    const newArray = [...tags.slice(0, idx), ...tags.slice(idx + 1)];
    setTags(newArray);
  };
  const handleTagChange = (e) => {
    setCurrentTag(e.target.value);
  };
  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (currentTag.trim() === '') {
      return;
    }
    if (tags.includes(currentTag)) {
      return;
    }
    setTags([...tags, currentTag]);
    setCurrentTag('');
  };
  const onSubmit = (data) => {
    const dataCopy = Object.assign({}, data);
    delete dataCopy.author;
    delete dataCopy.createdAt;
    delete dataCopy.favorited;
    delete dataCopy.favoritesCount;
    delete dataCopy.updatedAt;
    delete dataCopy.slug;
    if (tags.length !== 0) {
      dataCopy.tagList = tags;
    }
    let newData = {};
    newData.slug = slug;
    newData.article = dataCopy;
    const result = API.updateArticle(newData, userData.token).then(() => {
      loadArticles();
      setTimeout(() => history.push(`/articles/${slug}`), 200);
    });
  };
  if (article) {
    return (
      <div className={classes.editArticle}>
        <form className={classes.editArticle__form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className={classes.editArticle__title}>Edit article</h2>
          <label className={classes.editArticle__label}>
            Title
            <input
              type="text"
              name="title"
              placeholder="Title"
              className={classes.editArticle__input}
              {...register('title', {
                required: 'Please enter title',
              })}
            ></input>
            <p className={classes.editArticle__warning}>{errors.title?.message}</p>
          </label>
          <label className={classes.editArticle__label}>
            Short description
            <input
              type="text"
              name="description"
              placeholder="Short description"
              className={classes.editArticle__input}
              {...register('description', {
                required: 'Please enter description',
              })}
            ></input>
            <p className={classes.editArticle__warning}>{errors.description?.message}</p>
          </label>
          <label className={classes.editArticle__label}>
            Text
            <textarea
              name="body"
              placeholder="Text"
              className={classes.editArticle__input}
              {...register('body', {
                required: 'Please enter article text',
              })}
            ></textarea>
            <p className={classes.editArticle__warning}>{errors.body?.message}</p>
          </label>
          <div className={classes.editArticle__tags}>
            <label className={classes.editArticle__label}>
              Tags
              {checkAddedTags()}
              <div className={classes.editArticle__tagInput}>
                <input
                  type="text"
                  name="tag"
                  placeholder="Tag"
                  className={classes.editArticle__input}
                  value={currentTag}
                  onChange={handleTagChange}
                ></input>
                <button className={classes.editArticle__btn_add} onClick={(e) => handleTagSubmit(e)}>
                  Add tag
                </button>
              </div>
            </label>
          </div>
          <button className={classes.editArticle__btn}>Send</button>
        </form>
      </div>
    );
  }
  return <Spin size='large'/>;
};

export default EditArticle;