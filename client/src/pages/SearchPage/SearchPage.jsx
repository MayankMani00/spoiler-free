import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Typography from '@material-ui/core/Typography';

import { setSearchResult } from '../../redux/search/search.action';

import Spinner from '../../components/Spinner/Spinner';
import SearchOverview from '../../components/SearchOverview/SearchOverview';

function SearchPage({ query, searchResult, setSearchResult }) {
	const q = useParams();
	useEffect(
		() => {
			axios({
				url    : 'http://localhost:5000/search',
				method : 'post',
				data   : {
					query : q.query
				}
			})
				.then((response) => {
					setSearchResult({ ...response.data });
				})
				.catch((error) => {
					console.log('Oops ', error);
				});
		},
		[
			query
		]
	);

	if (!!!searchResult) return <Spinner />;
	return (
		!!searchResult && (
			<div>
				<SearchOverview
					category="Shows"
					results={searchResult.shows.slice(0, 5)}
				/>
				<SearchOverview
					category="Books"
					results={searchResult.books.items.slice(0, 5)}
				/>
				{searchResult.movies.Response === 'True' ? (
					<SearchOverview
						category="Movies"
						results={searchResult.movies.Search.slice(0, 5)}
					/>
				) : (
					<div>
						<Typography
							gutterBottom
							variant="h4"
							component="h2"
							style={{ color: '#fff', marginLeft: '5rem' }}
						>
							Movies:
						</Typography>
						<Typography
							gutterBottom
							variant="h4"
							component="h2"
							style={{ color: '#fff', marginLeft: '5rem' }}
						>
							No results found
						</Typography>
					</div>
				)}
			</div>
		)
	);
}

const mapStateToProps = (state) => ({
	query        : state.search.query,
	searchResult : state.search.searchResult
});

const mapDispatchToProps = (dispatch) => ({
	setSearchResult : (result) => dispatch(setSearchResult(result))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
