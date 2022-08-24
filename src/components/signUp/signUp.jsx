import { useForm } from 'react-hook-form';
import React, { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import API from '../../service/API';

import classes from './signUp.module.scss';

const SignUp = () => {
    const {register, handleSubmit, formState: { errors }, watch } = useForm();
    const [registered, setRegistered] = useState(false);
    const [regErrors, setRegErrors] = useState();
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = (data) => {
        const slicedData = Object.assign({}, data);
        delete slicedData.passwordRepeated;
        delete slicedData.checkbox;
        let newData = {};
        newData.user = slicedData;
    
    const result = API.createUser(newData).then((result) => {
        if (result.errors) {
            setRegErrors(result.errors);
        } else {
            setRegistered(true);
        }
    });
    }

    if (!registered) {
        return (
          <div className={classes.signUp}>
            <form className={classes.signUp__form} onSubmit={handleSubmit(onSubmit)} noValidate>
              <h2 className={classes.signUp__title}>Create new account</h2>
              <label className={classes.signUp__label}>
                Username
                <input
                  className={classes.signUp__input}
                  type="text"
                  name="username"
                  placeholder="Username"
                  {...register('username', {
                    required: 'Please enter username',
                    minLength: { value: 3, message: 'Please enter at least 3 characters.' },
                    maxLength: { value: 20, message: 'Please enter 20 characters maximum.' },
                  })}
                ></input>
                <p className={classes.signUp__warning}>{regErrors?.username}</p>
                <p className={classes.signUp__warning}>{errors.username?.message}</p>
              </label>
              <label className={classes.signUp__label}>
                Email address
                <input
                  className={classes.signUp__input}
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
                <p className={classes.signUp__warning}>{regErrors?.email}</p>
                <p className={classes.signUp__warning}>{errors.email?.message}</p>
              </label>
              <label className={classes.signUp__label}>
                Password
                <input
                  className={classes.signUp__input}
                  type="text"
                  name="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Please enter password',
                    minLength: { value: 6, message: 'Please enter at least 6 characters.' },
                    maxLength: { value: 40, message: 'Please enter 40 characters maximum.' },
                  })}
                ></input>
                <p className={classes.signUp__warning}>{errors.password?.message}</p>
              </label>
              <label className={classes.signUp__label}>
                Repeat password
                <input
                  className={classes.signUp__input}
                  type="text"
                  name="passwordRepeated"
                  placeholder="Repeat password"
                  {...register('passwordRepeated', {
                    validate: (value) => value === password.current || 'The passwords do not match',
                  })}
                ></input>
                <p className={classes.signUp__warning}>{errors.passwordRepeated?.message}</p>
              </label>
              <label className={classes.signUp__label_checkbox}>
                <input
                  defaultChecked
                  className={classes.signUp__input_checkbox}
                  type="checkbox"
                  name="checkbox"
                  {...register('checkbox', { required: 'Please agree to continue' })}
                ></input>
                I agree to the processing of my personal information
                <p className={classes.signUp__warning}>{errors.checkbox?.message}</p>
              </label>
              <button className={classes.signUp__btn}>Create</button>
              <span className={classes.signUp__link}>
              Already have an account?
                <Link to="/sign-in"> Sign In.</Link>
              </span>
            </form>
          </div>
        );
      }
      return <Redirect to="/sign-in" />;
    };


export default SignUp;