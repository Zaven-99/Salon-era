import React from 'react';



const CustomButton = ({label, className , onClick ,type, children , disabled}) => {
	return (
    <button disabled = {false || disabled} type={type} onClick={onClick} className={className}>
      <span>{label}</span>
      {children}
    </button>
  );
};

export default CustomButton;