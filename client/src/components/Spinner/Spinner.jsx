import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Spinner.css';

const Spinner = () => {
	return (
		<div className="spinner-overlay">
			<CircularProgress />
		</div>
	);
};

export default Spinner;
