import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import JoinButton from '../../components/JoinButton/JoinButton';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import ReactHtmlParser from 'react-html-parser';

import './ShowDetails.css';

const ShowDetails = () => {
	const [
		result,
		setResult
	] = useState(null);
	const [
		episodes,
		setEpisodes
	] = useState(null);
	const { showId } = useParams();
	useEffect(() => {
		const call = async () => {
			const res = await fetch(`https://api.tvmaze.com/shows/${showId}`);
			const data = await res.json();
			setResult(data);

			const response = await fetch(
				`https://api.tvmaze.com/shows/${showId}/episodes`
			);
			const d = await response.json();
			setEpisodes(d);
		};
		call();
	}, []);

	if (!!!result) return <Spinner />;

	var { image, genres, name, rating, summary } = result;
	if (!!image) image = image.medium;
	if (!!!genres) genres = [];
	if (!!!summary) summary = 'No summary available';

	if (!!!image)
		image =
			'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wMAI4g3qYHu9Tqrtrx77bAHaHa%26pid%3DApi&f=1';

	return (
		!!result &&
		!!episodes && (
			<Container maxWidth="lg">
				<Container
					maxWidth="md"
					style={{
						marginTop      : 40,
						display        : 'flex',
						justifyContent : 'center'
					}}
				>
					<img className="show-img" src={image} alt={name} />
				</Container>
				<Container maxWidth="md" style={{ justifyContent: 'center' }}>
					<Typography
						variant="h3"
						style={{ color: '#fff', textAlign: 'center' }}
					>
						{name}
					</Typography>
				</Container>
				<Container className="show-genre-container">
					<Typography
						variant="h4"
						style={{ color: '#fff', textAlign: 'center' }}
					>
						{genres.map((genre) => genre + ',')}
					</Typography>
				</Container>
				<Container maxWidth="md" className="show-rating">
					<Typography variant="h6" style={{ color: '#fff' }}>
						imdb: {rating.average}/10
					</Typography>
				</Container>
				<Container maxWidth="md" className="show-summary">
					<Paper elevation={2}>
						<Typography variant="subtitle1">
							{ReactHtmlParser(summary)}
						</Typography>
					</Paper>
				</Container>
				<Container maxWidth="md" className="show-episodes">
					<Paper
						elevation={2}
						key={-1}
						style={{
							margin    : '2px',
							marginTop : '10px',
							padding   : '5px 10px'
						}}
					>
						<Typography variant="subtitle2">
							Haven't started yet
						</Typography>
					</Paper>
					{episodes.map((episode) => {
						return (
							<Paper
								elevation={2}
								key={episode.id}
								style={{
									display        : 'flex',
									justifyContent : 'space-between',
									alignItems     : 'center',
									margin         : '2px',
									marginTop      : `${1 === episode.number
										? '10px'
										: '0'}`,
									padding        : '5px 10px'
								}}
							>
								<Typography variant="subtitle2">
									Season {episode.season} : Episode{' '}
									{episode.number}
								</Typography>
								<JoinButton
									target={{
										title : `${name}: S${episode.season}E${episode.number}`,
										id    : `${showId}-S${episode.season}-${episode.number}`
									}}
								/>
							</Paper>
						);
					})}
					<Paper
						elevation={2}
						key={0}
						style={{
							margin    : '2px',
							marginTop : '10px',
							padding   : '5px 10px'
						}}
					>
						<Typography variant="subtitle2">Finished</Typography>
					</Paper>
				</Container>
				<div className="active-rooms">1</div>
			</Container>
		)
	);
};

export default ShowDetails;
