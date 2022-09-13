import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import Input from '../input/input';

import API from '../../service/API';

import classes from './profile.module.scss';

const Profile = ({ userData, getLoggedUser }) => {
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
          <Input placeholder="Username" register={register} errors={errors} logErrors={logErrors} />
          <Input placeholder="Email address" register={register} errors={errors} logErrors={logErrors} />
          <Input placeholder="New password" register={register} errors={errors} logErrors={logErrors} />
          <Input placeholder="Avatar image" register={register} errors={errors} logErrors={logErrors} userData={userData} isUrl={isUrl}/>
          <button className={classes.profile__btn}>Save</button>
        </form>
      </div>
    );
  }
  return <Redirect to="/" />;
};

export default Profile;