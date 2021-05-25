import React from 'react';

import { Link } from 'react-router-dom';

import './BookPreview.css';

const BookPreview = (book) => {
	const { id, volumeInfo } = book.book;
	var { title, authors, description } = volumeInfo;
	let thumbnail =
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';

	title = title.substring(0, 40);
	description = !!description
		? description.substring(0, 100)
		: 'No description available';

	if (!!volumeInfo.imageLinks) thumbnail = volumeInfo.imageLinks.thumbnail;

	return (
		<div className="book-card">
			<img className="book-card-img" src={thumbnail} alt={title} />
			<Link to={`/book/${id}`}>
				<h3 className="book-card-title">{title}</h3>
			</Link>
			<h6 className="book-card-authors">
				{!!authors && authors.map((author) => author + ', ')}
			</h6>
			<p className="book-card-description">{description}</p>
		</div>
	);
};

export default BookPreview;
