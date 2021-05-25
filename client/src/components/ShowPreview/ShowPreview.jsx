import React from 'react';

import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

import './ShowPreview.css';

const ShowPreview = ({ show }) => {
	// console.log(show);
	if (!!show.show) show = show.show;
	let { id, name, genres, summary } = show;
	// console.log(show);
	let thumbnail =
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';

	name = name.substring(0, 40);
	summary = !!summary
		? summary.substring(0, 100) + '...'
		: 'No summary available';
	if (!!show.image && !!show.image.medium) thumbnail = show.image.medium;

	return (
		<div className="show-card">
			<img className="show-card-img" src={thumbnail} alt={name} />
			<Link to={`/show/${id}`}>
				<h3 className="show-card-title">{name}</h3>
			</Link>
			<h6 className="show-card-authors">
				{genres.map((genre) => genre + ', ')}
			</h6>
			<p className="show-card-description">{ReactHtmlParser(summary)}</p>
		</div>
	);
};

export default ShowPreview;
