import format from 'date-fns/format';
import { Link } from 'react-router-dom';

import likeInactive from '../../assets/like_inactive.svg';
import likeActive from '../../assets/like_active.svg';
import { TITLE_MAX_LENGTH } from '../../assets/titleMaxLength';
import API from '../../service/API'

import classes from './articleShort.module.scss';

const ArticleShort = ({ data, loggedIn, likes, addLike, removeLike, userData, loadArticles }) => {
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
  const textSlice = (text) => {
    if (text.length > TITLE_MAX_LENGTH) {
      let sliced = text.substring(0, TITLE_MAX_LENGTH);
      if (sliced.lastIndexOf(' ') === -1) {
        return `${sliced} ...`;
      }
      sliced = sliced.substring(0, Math.min(sliced.length, sliced.lastIndexOf(' ')));
      if (sliced[sliced.length - 1] === ',') {
        sliced = sliced.substring(0, sliced.length - 1);
      }
      return `${sliced} ...`;
    } else return text;
  };
  const handleLikeBtn = async () => {
    if (!likes.includes(data.slug)) {
      await API.favoriteArticle(data.slug, userData.token).then((result) => {
        addLike(data.slug);
        loadArticles();
      });
    } else {
      await API.unFavoriteArticle(data.slug, userData.token).then((result) => {
        removeLike(data.slug);
        loadArticles();
      });
    }
  };
  const like = likes.includes(data.slug) ? likeActive : likeInactive;
  return (
    <div className={classes.article}>
      <div className={classes.article__header}>
        <div className={classes.article__info}>
          <div className={classes.article__data}>
            <Link to={`/articles/${data.slug}`}>
              <h5 className={classes.article__title}>{textSlice(data.title)}</h5>
            </Link>
            <button disabled={!loggedIn} className={classes.article__likeBtn} onClick={handleLikeBtn}>
              <img src={like} alt="like"></img>
              <span className={classes.article__likes}>{data.favoritesCount}</span>
            </button>
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
      <p className={classes.article__descr}>{textSlice(data.description)}</p>
    </div>
  );
};

export default ArticleShort;