import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import JoinButton from '../../components/JoinButton/JoinButton';

import ReactHtmlParser from 'react-html-parser';

import './BookDetails.css';

const BookDetails = () => {
	const [
		result,
		setResult
	] = useState(null);
	let { bookId } = useParams();
	useEffect(() => {
		fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
			.then((res) => res.json())
			.then((data) => {
				setResult(data);
			});
	}, []);

	if (!!!result) return <Spinner />;

	const { volumeInfo } = result;
	var {
		title,
		authors,
		description,
		publishedDate,
		averageRating
	} = volumeInfo;
	let thumbnail =
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';

	if (!!!description) description = 'No description available';

	if (!!volumeInfo.imageLinks) thumbnail = volumeInfo.imageLinks.thumbnail;

	return (
		<Container maxWidth="lg">
			<Container
				maxWidth="md"
				style={{
					marginTop      : 40,
					display        : 'flex',
					justifyContent : 'center'
				}}
			>
				<img className="book-img" src={thumbnail} />
			</Container>
			<Container maxWidth="md" style={{ justifyContent: 'center' }}>
				<Typography
					variant="h3"
					style={{ color: '#fff', textAlign: 'center' }}
				>
					{title}
				</Typography>
			</Container>
			<div className="book-authors-container">
				<Typography
					variant="h4"
					style={{ color: '#fff', textAlign: 'center' }}
				>
					{authors.map((author) => author + ', ')}
				</Typography>
			</div>
			<Container maxWidth="md" className="book-release-year">
				<Typography variant="h5" style={{ color: '#fff' }}>
					Published: {publishedDate}
				</Typography>
			</Container>
			<Container maxWidth="md" className="book-rating">
				<Typography
					variant="h6"
					style={{ color: '#fff', marginBottom: '50px' }}
				>
					Rating on Google Books: {averageRating}/5
				</Typography>
			</Container>
			<Container maxWidth="md" className="book-description">
				<Paper elevation={2}>
					<Typography style={{ padding: '1rem' }}>
						{ReactHtmlParser(description)}
					</Typography>
				</Paper>
			</Container>
			<Paper
				elevation={2}
				key={0}
				style={{
					display        : 'flex',
					justifyContent : 'space-between',
					alignItems     : 'center',
					margin         : '2px',
					marginTop      : '10px',
					padding        : '5px 10px'
				}}
			>
				<Typography variant="subtitle2">Haven't started yet</Typography>
				<JoinButton
					target={{ title: title, id: `${bookId}/started` }}
				/>
			</Paper>
			<Paper
				elevation={2}
				key={1}
				style={{
					display        : 'flex',
					justifyContent : 'space-between',
					alignItems     : 'center',
					margin         : '2px',
					marginTop      : '10px',
					padding        : '5px 10px'
				}}
			>
				<Typography variant="subtitle2">Finished</Typography>
				<JoinButton
					target={{ title: title, id: `${bookId}/finished` }}
				/>
			</Paper>
		</Container>
	);
};

export default BookDetails;
