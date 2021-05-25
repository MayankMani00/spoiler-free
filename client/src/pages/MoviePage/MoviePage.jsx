import React from 'react';

import { Route } from 'react-router-dom';

import MovieDetails from '../MovieDetails/MovieDetails';

const MoviePage = ({ match }) => {
	return (
		<div className="movie-page">
			<Route path={`${match.path}/:imdbID`} component={MovieDetails} />
		</div>
	);
};

export default MoviePage;
