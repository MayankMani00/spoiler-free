import React, { useState, useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Notification = ({ message }) => {
	const [
		open,
		setOpen
	] = useState(true);

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={open}
				onClose={handleClose}
				message={message}
				key="1"
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleClose}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		</div>
	);
};

export default Notification;
