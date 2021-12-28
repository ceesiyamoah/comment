import React from 'react';
import './index.scss';
import { createPortal } from 'react-dom';
const Modal = ({ children, open, onClose }) => {
	if (!open) return null;
	return createPortal(
		<>
			<div className='overlay' onClick={onClose} />
			<div className='content'>{children}</div>
		</>,
		document.getElementById('portal')
	);
};

export default Modal;
