import React, { useState } from 'react';

import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setQuery, setSearchResult } from '../../redux/search/search.action';

import TextField from '@material-ui/core/TextField';

import './SearchBox.css';

const SearchBox = ({ setQuery, setSearchResult }) => {
	const [
		localQuery,
		setLocalQuery
	] = useState();

	const history = useHistory();

	const handleSubmit = (e) => {
		e.preventDefault();
		setQuery(localQuery);
		setSearchResult(null);
		setLocalQuery('');
		localQuery.replace(/\s+/g, '+');
		history.push(`/search/${localQuery}`);
	};
	return (
		<React.Fragment>
			<form
				onSubmit={(e) => {
					handleSubmit(e);
				}}
				className="search-box"
			>
				<TextField
					style={{ width: '100%' }}
					// className="search-box"
					id="outlined-basic"
					// label="Outlined"
					placeholder="Search for books..."
					variant="outlined"
					size="small"
					autoComplete="off"
					autoCapitalize="off"
					color="secondary"
					onChange={(e) => setLocalQuery(e.target.value)}
				/>
			</form>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	query : state.search.query
});

const mapDispatchToProps = (dispatch) => ({
	setQuery        : (query) => dispatch(setQuery(query)),
	setSearchResult : (res) => dispatch(setSearchResult(res))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
