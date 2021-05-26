import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import theme from '../../theme';

import BookPreview from '../../components/BookPreview/BookPreview';
import ShowPreview from '../../components/ShowPreview/ShowPreview';
import MoviePreview from '../../components/MoviePreview/MoviePreview';
import Description from '../../components/Description/Description';

import { books, shows, movies } from './data';

const useStyles = makeStyles({
	root  : {
		width          : '90%',
		display        : 'flex',
		justifyContent : 'center',
		margin         : 'auto'
	},
	media : {
		height : 140
	}
});

function HomePage() {
	const classes = useStyles();
	// console.log(shows);
	return (
		<React.Fragment>
			<Description />
			<Typography
				gutterBottom
				variant="h4"
				component="h2"
				style={{ color: '#fff', marginLeft: '5rem' }}
			>
				Popular Shows
			</Typography>
			<Grid container className={classes.root}>
				<ThemeProvider theme={theme}>
					{shows.map((show) => (
						<ShowPreview key={show.id} show={show} />
					))}
				</ThemeProvider>
			</Grid>
			<Typography
				gutterBottom
				variant="h4"
				component="h2"
				style={{ color: '#fff', marginLeft: '5rem' }}
			>
				Popular Books
			</Typography>
			<Grid container className={classes.root}>
				<ThemeProvider theme={theme}>
					{books.map((book) => (
						<BookPreview key={book.id} book={book} />
					))}
				</ThemeProvider>
			</Grid>
			<Typography
				gutterBottom
				variant="h4"
				component="h2"
				style={{ color: '#fff', marginLeft: '5rem' }}
			>
				Popular Movies
			</Typography>
			<Grid container className={classes.root}>
				<ThemeProvider theme={theme}>
					{movies.map((movie) => (
						<MoviePreview key={movie.imdbID} movie={movie} />
					))}
				</ThemeProvider>
			</Grid>
		</React.Fragment>
	);
}

export default HomePage;
