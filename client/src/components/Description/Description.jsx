import React from 'react';
import Typography from '@material-ui/core/Typography';

import './Description.css';

const Description = () => {
	return (
		<div
			style={{
				height         : '300px',
				display        : 'flex',
				justifyContent : 'center',
				alignItems     : 'center',
				color          : '#fff'
			}}
		>
			<Typography gutterBottom variant="h6" component="h2" align="center">
				Find people you can gush about your favourite show / book /
				movie to without getting any spoilers!
			</Typography>
		</div>
	);
};

export default Description;
