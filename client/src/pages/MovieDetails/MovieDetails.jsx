import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner';
import JoinButton from '../../components/JoinButton/JoinButton';
import Notification from '../../components/Notification/Notification';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

import './MovieDetails.css';

const MovieDetails = () => {
	const [
		result,
		setResult
	] = useState(null);
	const [
		notificationMessage,
		setNotificationMessage
	] = useState(null);
	const { imdbID } = useParams();
	useEffect(() => {
		axios({
			url    : '/getMovie',
			method : 'post',
			data   : {
				id : imdbID
			}
		})
			.then((response) => {
				setResult({ ...response.data });
			})
			.catch((error) => {
				// console.log('Oops ', error);
				setNotificationMessage(error.message);
				setTimeout(() => {
					setNotificationMessage(null);
				}, 5000);
			});
	}, []);

	if (!!!result) return <Spinner />;

	var { Genre, Poster, imdbRating, Year, Runtime, Title, Plot } = result;

	if (!!!Plot) Plot = 'No description available';

	if (!!!Poster)
		Poster =
			'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';
	return (
		<React.Fragment>
			<Container maxWidth="lg">
				<Container
					maxWidth="md"
					style={{
						marginTop      : 40,
						display        : 'flex',
						justifyContent : 'center'
					}}
				>
					<img className="movie-img" src={Poster} />
				</Container>
				<Container maxWidth="md" style={{ justifyContent: 'center' }}>
					<Typography
						variant="h3"
						style={{ color: '#fff', textAlign: 'center' }}
					>
						{Title}
					</Typography>
				</Container>
				<Container className="movie-genre-container">
					<Typography
						variant="h4"
						style={{ color: '#fff', textAlign: 'center' }}
					>
						{Genre}
					</Typography>
				</Container>
				<Container maxWidth="md" className="movie-release-year">
					<Typography variant="h5" style={{ color: '#fff' }}>
						Released: {Year}
					</Typography>
				</Container>
				<Container maxWidth="md" className="movie-rating">
					<Typography variant="h6" style={{ color: '#fff' }}>
						imdb: {imdbRating}/10
					</Typography>
				</Container>
				<Container maxWidth="md" className="movie-runtime">
					<Typography
						variant="h5"
						style={{ color: '#fff', marginBottom: '50px' }}
					>
						Runtime: {Runtime}
					</Typography>
				</Container>
				<Container maxWidth="md" className="movie-plot">
					<Paper elevation={2} style={{ background: '#343434' }}>
						<Typography
							variant="subtitle1"
							style={{
								color        : 'white',
								padding      : '1rem',
								marginBottom : '5rem'
							}}
						>
							{Plot}
						</Typography>
					</Paper>
				</Container>
				<Container maxWidth="md">
					<Paper elevation={2} key={0} className="list-item">
						<Typography variant="subtitle2">
							Haven't started yet
						</Typography>
						<JoinButton
							target={{ title: Title, id: `${imdbID}/started` }}
						/>
					</Paper>
					<Paper elevation={2} key={1} className="list-item">
						<Typography variant="subtitle2">Finished</Typography>
						<JoinButton
							target={{ title: Title, id: `${imdbID}/finished` }}
						/>
					</Paper>
				</Container>
			</Container>
			{!!notificationMessage && (
				<Notification message={notificationMessage} />
			)}
		</React.Fragment>
	);
};

export default MovieDetails;
