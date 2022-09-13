import { useForm } from 'react-hook-form';
import React, { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Input from '../input/input';

import API from '../../service/API';

import classes from './signUp.module.scss';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
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
  };

  if (!registered) {
    return (
      <div className={classes.signUp}>
        <form className={classes.signUp__form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className={classes.signUp__title}>Create new account</h2>
          <Input placeholder="Username" register={register} errors={errors} />
          <Input placeholder="Email address" register={register} errors={errors} />
          <Input placeholder="Password" register={register} errors={errors} />
          <Input placeholder="Repeat password" register={register} errors={errors} password={password}/>
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