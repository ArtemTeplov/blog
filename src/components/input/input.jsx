import React from "react";


import classes from "./input.module.scss";

const Input = ( {register, errors, placeholder, logErrors, userData, isUrl, password}) => {
  if (placeholder === 'Title'){
    return (
      <label className={classes.article__label}>
                  {placeholder}
                  <input
                    type="text"
                    name={`${placeholder.toLowerCase()}`}
                    placeholder={placeholder}
                    className={classes.article__input}
                    {...register(`${placeholder.toLowerCase()}`, {
                      required: `Please enter the ${placeholder.toLowerCase()}`,
                    })}
                  ></input>
                  <p className={classes.worning}>{errors.title?.message}</p>
                </label>)
  } else if (placeholder === 'Short description'){
    return (
      <label className={classes.article__label}>
                  {placeholder}
                  <input
                    type="text"
                    name="description"
                    placeholder={placeholder}
                    className={classes.article__input}
                    {...register("description", {
                      required: `Please enter the ${placeholder.toLowerCase()}`,
                    })}
                  ></input>
                  <p className={classes.worning}>{errors.description?.message}</p>
                </label>
    )
  } else if (placeholder === 'Text'){
      return (
        <label className={classes.article__label}>
            Text
            <textarea
              name="body"
              placeholder="Text"
              className={classes.article__input}
              {...register('body', {
                required: 'Please enter article text',
              })}
            ></textarea>
            <p className={classes.warning}>{errors.body?.message}</p>
        </label>
      )
} else if (placeholder === 'Username'){
  return (
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
            <p className={classes.warning}>{logErrors?.username && `Username ${logErrors?.username}`}</p>
            <p className={classes.warning}>{errors.username?.message}</p>
          </label>
  )
} else if (placeholder === 'Email address') {
  return (
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
            <p className={classes.warning}>{logErrors?.email && `Username ${logErrors?.email}`}</p>
            <p className={classes.warning}>{errors.email?.message}</p>
          </label>)
} else if (placeholder === 'New password'){
  return (
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
            <p className={classes.warning}>{logErrors?.password}</p>
            <p className={classes.warning}>{errors.password?.message}</p>
          </label>
  )
} else if (placeholder === 'Avatar image'){
  return (
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
            <p className={classes.warning}>{logErrors?.image}</p>
            <p className={classes.warning}>{errors.image?.message}</p>
          </label>)
} else if (placeholder === 'Password'){
  return (
    <label className={classes.profile__label}>
            Password
            <input
              className={classes.profile__input}
              type="text"
              name="password"
              placeholder="Password"
              {...register('password', {
                required: 'Please enter password',
                minLength: { value: 6, message: 'Please enter at least 6 characters.' },
                maxLength: { value: 40, message: 'Please enter 40 characters maximum.' },
              })}
            ></input>
            <p className={classes.warning}>{errors.password?.message}</p>
          </label>)
} else if (placeholder === 'Repeat password'){
  return (
    <label className={classes.profile__label}>
            Repeat password
            <input
              className={classes.profile__input}
              type="text"
              name="passwordRepeated"
              placeholder="Repeat password"
              {...register('passwordRepeated', {
                validate: (value) => value === password.current || 'The passwords do not match',
              })}
            ></input>
            <p className={classes.warning}>{errors.passwordRepeated?.message}</p>
          </label>)
}
}

export default Input;
