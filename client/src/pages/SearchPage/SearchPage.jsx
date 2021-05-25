import React, { useState } from 'react';

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
	let t = Date.now();
	t.setSeconds(t.getSeconds() + 10);
	const [
		Stuck,
		setStuck
	] = useState(false);
	const [
		notificationMessage,
		setNotificationMessage
	] = useState(null);
	const timer = setIntreval(() => {
		if (time == Date.now()) setStuck(true);
	}, 1000);
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
					clearInterval(timer);
				})
				.catch((error) => {
					setNotificationMessage(e.response.data.message);
					setInterval(() => {
						setNotificationMessage(null);
					}, 5000);
					clearInterval(timer);
				});
		},
		[
			query
		]
	);
	if (stuck) {
		clearInterval(timer);
		setNotificationMessage('An error occurred :(');
		setInterval(() => {
			setNotificationMessage(null);
		}, 5000);
		clearTimeout(timer);
	}
	if (!!!searchResult) return <Spinner />;
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
			<Notification message={notificationMessage} />
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
