import React from 'react';

import BookPreview from '../BookPreview/BookPreview';
import ShowPreview from '../ShowPreview/ShowPreview';
import MoviePreview from '../MoviePreview/MoviePreview';

import theme from '../../theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

const SearchOverview = ({ category, results }) => {
	const classes = useStyles();
	if (!!!results)
		return (
			<div>
				<Typography
					gutterBottom
					variant="h4"
					component="h2"
					style={{ color: '#fff', marginLeft: '5rem' }}
				>
					No results found
				</Typography>
			</div>
		);
	return (
		<div>
			<React.Fragment>
				<Typography
					gutterBottom
					variant="h4"
					component="h2"
					style={{ color: '#fff', marginLeft: '5rem' }}
				>
					{category}:
				</Typography>
				{!!!results && (
					<Typography
						gutterBottom
						variant="h4"
						component="h2"
						style={{ color: '#fff', marginLeft: '5rem' }}
					>
						No results found
					</Typography>
				)}
				{category === 'Books' && (
					<Grid container className={classes.root}>
						<ThemeProvider theme={theme}>
							{results.map((item) => (
								<BookPreview key={item.id} book={item} />
							))}
						</ThemeProvider>
					</Grid>
				)}

				{category === 'Shows' && (
					<Grid container className={classes.root}>
						<ThemeProvider theme={theme}>
							{results.map((item) => (
								<ShowPreview key={item.id} show={item} />
							))}
						</ThemeProvider>
					</Grid>
				)}

				{category === 'Movies' && (
					<Grid container className={classes.root}>
						<ThemeProvider theme={theme}>
							{results.map((item) => (
								<MoviePreview key={item.id} movie={item} />
							))}
						</ThemeProvider>
					</Grid>
				)}
			</React.Fragment>
		</div>
	);
};

export default SearchOverview;
