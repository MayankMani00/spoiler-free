import React from 'react';

import { Link } from 'react-router-dom';

import './MoviePreview.css';

const MoviePreview = (movie) => {
	console.log(movie.movie);
	if (!!movie.movie) movie = movie.movie;
	let { imdbID, Title, Year, Poster } = movie;

	Title = Title.substring(0, 40);
	// summary = !!summary ? summary.substring(0, 100) : 'No summary available';

	if (!!!Poster)
		Poster =
			'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';

	return (
		<div className="movie-card">
			<img className="movie-card-img" src={Poster} />
			<Link to={`/movie/${imdbID}`}>
				<h3 className="movie-card-title">{Title}</h3>
			</Link>
			<h6 className="movie-card-year">{Year}</h6>
			{/* <p className="movie-card-description">{summary}</p> */}
		</div>
	);
};

export default MoviePreview;
