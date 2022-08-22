import format from 'date-fns/format';
import { Link } from 'react-router-dom';

import likeInactive from '../../assets/like_inactive.svg';
import likeActive from '../../assets/like_active.svg';

import classes from './articleShort.module.scss';

const ArticleShort = ({ data, loggedIn }) => {
  let tags;
  if (data.tagList.length > 0) {
    tags = data.tagList.map((item, idx) => {
      return (
        <button key={idx} className={classes.article__tag}>
          {item}
        </button>
      );
    });
  }

  const like = data.favorited && loggedIn ? likeActive : likeInactive;

  return (
    <div className={classes.article}>
      <div className={classes.article__header}>
        <div className={classes.article__info}>
          <div className={classes.article__data}>
            <Link to={`/articles/${data.slug}`}>
              <h5 className={classes.article__title}>{data.title}</h5>
            </Link>
            <button className={classes.article__likeBtn} onClick={() => console.log('like')}>
              <img src={like} alt="like"></img>
            </button>
            <span className={classes.article__likes}>{data.favoritesCount}</span>
          </div>
          <div className={classes.article__tags}>{tags}</div>
        </div>
        <div className={classes.article__author}>
          <div>
            <h6 className={classes.article__name}>{data.author.username}</h6>
            <span className={classes.article__date}>{format(new Date(data.createdAt), 'MMMM d, y')}</span>
          </div>
          <img className={classes.article__avatar} src={data.author.image} alt="author avatar"></img>
        </div>
      </div>
      <p className={classes.article__descr}>{data.description}</p>
    </div>
  );
};

export default ArticleShort;