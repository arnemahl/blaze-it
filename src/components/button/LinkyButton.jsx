import React from 'react';
import './LinkyButton.scss';

const LinkyButton = ({className, children, ...otherProps}) => (
    <a className={'our-fancy-linky-button ' + (className || '')} {...otherProps}>
        {children}
    </a>
);

const {string, node} = React.PropTypes;

LinkyButton.propTypes = {
    href: string.isRequired,
    children: node.isRequired
};

export default LinkyButton;
