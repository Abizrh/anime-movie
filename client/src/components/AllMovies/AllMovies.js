import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllMovies.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { BASE_URL } from "../../constants/constant";
import { Star, FavoriteBorder, Favorite } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { fetchGenre } from "../../store/actions/action-movie";
import { useSelector, useDispatch } from "react-redux";
import { trunc } from "../../helpers/helpers";
import { addMovieToWatchList, removeWatchList } from "../../store/actions/action-watchList";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AllMovies = ({
  id,
  img,
  title,
  type,
  release_date,
  image,
  rate,
  grid,
  genre,
  page
}) => {
  const [icon, setIcon] = useState(<FavoriteBorder />);
  const [open, setOpen] = useState(false);
  const year = new Date(release_date);
  const movies = useSelector((state) => state.movie);
  const watchList = useSelector((state) => state.watchList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGenre());
  }, []);

  const movieGenre = movies.genres?.genres;

  const favorites = {
    id,
    img,
    title,
    type,
    release_date,
    image,
    rate,
    grid,
    genre,
  };

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList?.watchList));
  }, [watchList]);

  const favHandler = () => {
    setIcon(<Favorite />);
    setOpen(true);
    dispatch(addMovieToWatchList(favorites));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const deleteHandler = () => dispatch(removeWatchList(id))

  const fixGenre = movieGenre?.filter((el) => genre.includes(el.id));

    // Check if watchList already stored or not.
  const storedMovie = watchList?.watchList?.find((list) => list.id === id);
  const watchDisabled = storedMovie ? true : false;

  const g = [];
  fixGenre?.forEach((el) => {
    g.push(el.name);
  });

  const action = (
    <>
      <Button color="primary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        onClick={handleClose}
        color="inherit"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <article className="card">
        <Link to={`/${type}/${id}`}>
          <picture className="thumbnail">
            <LazyLoadImage
              src={image ? image : `${BASE_URL}${img}`}
              alt={title}
              effect="blur"
            />
          </picture>
        </Link>
        <div
          className="fav"
          onClick={() =>
            page !== "/favorite" ? favHandler() : deleteHandler()
          }
        >
          {page !== "/favorite" ? (
            !watchDisabled ? (
              icon
            ) : (
              <FavoriteIcon />
            )
          ) : (
            <DeleteIcon />
          )}
        </div>
        <div className="movie__name">
          <h3>{trunc(title, 18)}</h3>
          <h5 style={{ color: "#111111" }}>{trunc(g.join(", "), 18)}</h5>
        </div>
        <div className="movie__other">
          <p>
            {year?.getFullYear()}
            <span>
              {rate}
              <Star />
            </span>
          </p>
          <p>{type}</p>
        </div>
        <div className="card-content"></div>
      </article>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Added to Favorites"
        action={action}
        ContentProps={{
          sx: { background: "white", color: "black" },
        }}
      />
    </>
  );
};

export default AllMovies;
