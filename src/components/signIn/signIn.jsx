import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';

import API from '../../service/API';
import storage from '../../service/storage';

import classes from './signIn.module.scss';

const SignIn = ({ loginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loggedIn, setLoggedIn] = useState(false);
  const [logErrors, setLogErrors] = useState();

  const onSubmit = (data) => {
    const dataCopy = Object.assign({}, data);
    let newData = {};
    newData.user = dataCopy;

    const result = API.loginUser(newData).then((result) => {
      if (result.errors) {
        setLogErrors(result.errors);
      } else {
        setLoggedIn(true);
        storage.setToStorage('token', result.user.token);
        loginSuccess(result.user);
      }
    });
  };
  if (!loggedIn) {
    return (
      <div className={classes.signIn}>
        <form className={classes.signIn__form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className={classes.signIn__title}>Sign In</h2>
          {logErrors && (
            <p className={classes.signIn__warning}>{`Email or password ${logErrors['email or password']}`}</p>
          )}
          <label className={classes.signIn__label}>
            Email address
            <input
              className={classes.signIn__input}
              type="email"
              name="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Please enter email',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            ></input>
            <p className={classes.signIn__warning}>{errors.email?.message}</p>
          </label>
          <label className={classes.signIn__label}>
            Password
            <input
              className={classes.signIn__input}
              type="text"
              name="password"
              placeholder="Password"
              {...register('password', {
                required: 'Please enter password',
              })}
            ></input>
            <p className={classes.signIn__warning}>{errors.password?.message}</p>
          </label>
          <button className={classes.signIn__btn}>Login</button>
          <span className={classes.signIn__link}>
            Don&apos;t have an account?
            <Link to="/sign-up"> Sign Up.</Link>
          </span>
        </form>
      </div>
    );
  }
  return <Redirect to="/" />;
};

export default SignIn;