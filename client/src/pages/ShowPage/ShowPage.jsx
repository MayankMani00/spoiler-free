import React from 'react';

import { Route } from 'react-router-dom';

import ShowDetails from '../ShowDetails/ShowDetails';

const ShowPage = ({ match }) => {
	return (
		<div className="show-page">
			<Route path={`${match.path}/:showId`} component={ShowDetails} />
		</div>
	);
};

export default ShowPage;
