import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import Typography from '@material-ui/core/Typography';

import { setSearchResult } from '../../redux/search/search.action';

import Spinner from '../../components/Spinner/Spinner';
import SearchOverview from '../../components/SearchOverview/SearchOverview';
import Notification from '../../components/Notification/Notification';

function SearchPage({ query, searchResult, setSearchResult }) {
	const q = useParams();

	const [
		notificationMessage,
		setNotificationMessage
	] = useState(null);
	useEffect(
		() => {
			axios({
				url                 : '/search',
				method              : 'post',
				data                : {
					query : q.query
				},
				timeout             : 10000,
				timeoutErrorMessage : 'Request timed out'
			})
				.then((response) => {
					setSearchResult({ ...response.data });
				})
				.catch((error) => {
					console.log(error.message);
					console.log(error.response.data);
					if (!!error.response && !!error.response.data)
						setNotificationMessage(error.response.data.message);
					else setNotificationMessage(error.message);
					setTimeout(() => {
						setNotificationMessage(null);
					}, 5000);
				});
		},
		[
			query
		]
	);

	if (!!!searchResult)
		return (
			<React.Fragment>
				<Spinner />{' '}
				{!!notificationMessage && (
					<Notification
						message={notificationMessage}
						style={{ zIndex: 10 }}
					/>
				)}
			</React.Fragment>
		);
	return (
		<React.Fragment>
			{!!searchResult && (
				<div>
					<SearchOverview
						category="Shows"
						results={searchResult.shows.slice(0, 5)}
					/>
					<SearchOverview
						category="Books"
						results={searchResult.books.items.slice(0, 5)}
					/>
					{!!searchResult.movies &&
					searchResult.movies.Response === 'True' ? (
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
			)}
			{!!notificationMessage && (
				<Notification
					message={notificationMessage}
					style={{ zIndex: 10 }}
				/>
			)}
		</React.Fragment>
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
