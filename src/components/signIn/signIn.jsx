import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';

import Input from '../input/input';

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
          <Input placeholder="Email address" register={register} errors={errors}/>
          <Input placeholder="Password" register={register} errors={errors}/>
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