import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';

import API from '../../service/API';

import classes from './profile.module.scss';

const Profile = ({ userData, getLoggedUser, loggedIn }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: userData,
  });
  const [logErrors, setLogErrors] = useState();
  const [edited, setEdited] = useState(false);

  const onSubmit = (data) => {
    const dataCopy = Object.assign({}, data);
    removeEmptyFields(dataCopy);
    let newData = {};
    newData.user = dataCopy;
    const result = API.updateUser(newData).then((result) => {
      if (result.errors) {
        setLogErrors(result.errors);
      } else {
        setEdited(true);
        getLoggedUser();
      }
    });
  };

  function removeEmptyFields(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === '' || obj[key] == null) {
        delete obj[key];
      }
    });
  }
  function isUrl(string) {
    if (string === '') {
      return true;
    }
    let url;
    try {
      url = new URL(string);
    } catch (e) {
      return false;
    }
    return true;
  }
  if (!edited) {
    return (
      <div className={classes.profile}>
        <form className={classes.profile__form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className={classes.profile__title}>Edit profile</h2>
          <label className={classes.profile__label}>
            Username
            <input
              className={classes.profile__input}
              type="text"
              name="username"
              placeholder="Username"
              {...register('username', {
                required: 'Please enter new username',
                minLength: { value: 3, message: 'Please enter at least 3 characters.' },
                maxLength: { value: 20, message: 'Please enter 20 characters maximum.' },
              })}
            ></input>
            <p className={classes.profile__warning}>{logErrors?.username && `Username ${logErrors?.username}`}</p>
            <p className={classes.profile__warning}>{errors.username?.message}</p>
          </label>
          <label className={classes.profile__label}>
            Email address
            <input
              className={classes.profile__input}
              type="email"
              name="email"
              placeholder="Email"
              {...register('email', {
                required: 'Please enter new email',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            ></input>
            <p className={classes.profile__warning}>{logErrors?.email && `Username ${logErrors?.email}`}</p>
            <p className={classes.profile__warning}>{errors.email?.message}</p>
          </label>
          <label className={classes.profile__label}>
            New password
            <input
              className={classes.profile__input}
              type="text"
              name="password"
              placeholder="New password"
              {...register('password', {
                minLength: { value: 6, message: 'Please enter at least 6 characters.' },
                maxLength: { value: 40, message: 'Please enter 40 characters maximum.' },
              })}
            ></input>
            <p className={classes.profile__warning}>{logErrors?.password}</p>
            <p className={classes.profile__warning}>{errors.password?.message}</p>
          </label>
          <label className={classes.profile__label}>
            Avatar image &#40;url&#41;
            <input
              className={classes.profile__input}
              type="text"
              name="image"
              defaultValue="none"
              placeholder={userData?.image ? userData.image : 'Avatar image'}
              {...register('image', {
                validate: (value) => isUrl(value) || 'Please enter a valid url',
              })}
              onFocus={(event) => event.target.select()}
            ></input>
            <p className={classes.profile__warning}>{logErrors?.image}</p>
            <p className={classes.profile__warning}>{errors.image?.message}</p>
          </label>
          <button className={classes.profile__btn}>Save</button>
        </form>
      </div>
    );
  }
  return <Redirect to="/" />;
};

export default Profile;