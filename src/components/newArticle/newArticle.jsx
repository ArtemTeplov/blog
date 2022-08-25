import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import API from '../../service/API';

import classes from './newArticle.module.scss';

const NewArticle = ({ userData, loadArticles }) => {
  let history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
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
  const handleTagDelete = (e, item) => {
    e.preventDefault();
    const idx = tags.findIndex((el) => el === item);
    const newArray = [...tags.slice(0, idx), ...tags.slice(idx + 1)];
    setTags(newArray);
  };
  const checkAddedTags = () => {
    if (tags.length !== 0) {
      return tags.map((item) => {
        return (
          <div key={item}>
            <input disabled className={classes.newArticle__input} value={item}></input>
            <button className={classes.newArticle__btn_delete} onClick={(e) => handleTagDelete(e, item)}>
              Delete tag
            </button>
          </div>
        );
      });
    }
  };
  const onSubmit = (data) => {
    const dataCopy = Object.assign({}, data);
    if (tags.length !== 0) {
      dataCopy.tagList = tags;
    }
    let newData = {};
    newData.article = dataCopy;
    const result = API.createArticle(newData, userData.token).then((result) => {
      loadArticles();
      setTimeout(() => history.push('/'), 200);
    });
  };
  return (
    <div className={classes.newArticle}>
      <form className={classes.newArticle__form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className={classes.newArticle__title}>Create new article</h2>
        <label className={classes.newArticle__label}>
          Title
          <input
            type="text"
            name="title"
            placeholder="Title"
            className={classes.newArticle__input}
            {...register('title', {
              required: 'Please enter title',
            })}
          ></input>
          <p className={classes.newArticle__warning}>{errors.title?.message}</p>
        </label>
        <label className={classes.newArticle__label}>
          Short description
          <input
            type="text"
            name="description"
            placeholder="Short description"
            className={classes.newArticle__input}
            {...register('description', {
              required: 'Please enter description',
            })}
          ></input>
          <p className={classes.newArticle__warning}>{errors.description?.message}</p>
        </label>
        <label className={classes.newArticle__label}>
          Text
          <textarea
            name="body"
            placeholder="Text"
            className={classes.newArticle__input}
            {...register('body', {
              required: 'Please enter article text',
            })}
          ></textarea>
          <p className={classes.newArticle__warning}>{errors.body?.message}</p>
        </label>
        <div className={classes.newArticle__tags}>
          <label className={classes.newArticle__label}>
            Tags
            {checkAddedTags(tags)}
            <div className={classes.newArticle__tagInput}>
              <input
                type="text"
                name="tag"
                placeholder="Tag"
                className={classes.newArticle__input}
                value={currentTag}
                onChange={handleTagChange}
              ></input>
              <button className={classes.newArticle__btn_add} onClick={(e) => handleTagSubmit(e)}>
                Add tag
              </button>
            </div>
          </label>
        </div>
        <button className={classes.newArticle__btn}>Send</button>
      </form>
    </div>
  );
};
export default NewArticle;