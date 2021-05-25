import React from 'react';
import { Route } from 'react-router-dom';
import BookDetails from '../BookDetails/BookDetails';

const BookPage = ({ match }) => {
	console.log('bpage');
	return (
		<div className="book-page">
			<Route path={`${match.path}/:bookId`} component={BookDetails} />
		</div>
	);
};

export default BookPage;
