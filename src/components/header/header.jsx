import { Link } from 'react-router-dom';

import classes from './header.module.scss';

const Header = () => {
  return (
    <nav className={classes.header}>
      <ul className={classes.header__block}>
        <li className={classes.header__item}>
          <Link to="/" className={classes.header__link}>
            Realworld Blog
          </Link>
        </li>
      </ul>
      <ul className={classes.header__block}>
        <li className={classes.header__item}>
          <a className={classes.header__link} href="#">
            Sign In
          </a>
        </li>
        <li className={classes.header__item}>
          <a className={classes.header__link} href="#">
            Sign Up
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
