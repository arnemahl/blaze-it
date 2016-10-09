import React from 'react';
import './InputButton.scss';

const InputButton = ({className, children, ...otherProps}) => (
    <input
        className={'our-fancy-input-button ' + (className || '')}
        value={children}
        type="button"
        {...otherProps}
        />
);

export default InputButton;
