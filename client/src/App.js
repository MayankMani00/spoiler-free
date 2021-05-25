import React, { lazy, Suspense } from 'react';

import { Route, Switch } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage/SearchPage'));
const BookPage = lazy(() => import('./pages/BookPage/BookPage'));
const ShowPage = lazy(() => import('./pages/ShowPage/ShowPage'));
const MoviePage = lazy(() => import('./pages/MoviePage/MoviePage'));

function App() {
	return (
		<div className="App">
			<Navbar />
			<Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/search/:query" component={SearchPage} />
					<Route path="/book" component={BookPage} />
					<Route path="/show" component={ShowPage} />
					<Route path="/movie" component={MoviePage} />
				</Switch>
			</Suspense>
		</div>
	);
}

export default App;
