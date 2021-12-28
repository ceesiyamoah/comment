import React from 'react';
const SolidButton = ({ text, color, onClick, ...rest }) => {
	return (
		<button
			className='counter__button-text main_button'
			style={{ backgroundColor: color }}
			onClick={onClick}
			{...rest}
		>
			{text.toUpperCase()}
		</button>
	);
};

export default SolidButton;
