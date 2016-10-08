import React from 'react';
import './IconWooperate.scss';

const IconWooperate = ({className, props}) => (
    <svg
        viewBox="0 0 100 100"
        className={"icon-wooperate " + (className || '')}
        {...props}
        >
        <defs>
            <style type="text/css">
                
            </style>
        </defs>
        <path d="M 10,75 L 50,97 L 90,75 L20,0 Z" height="80" fill="#ffa610" />
        <path d="M 10,75 L 50,97 L 90,75 L50,10 Z" height="80" fill="#f5820c" />
        <path d="M 10,75 L 50,97 L 90,75 L80,20 Z" height="80" fill="#ffcb2d" />
        <text
            x="50" y="80"
            textAnchor="middle"
            fontSize="70"
            fill="#039be5" stroke="none"
            >
            w
        </text>
    </svg>
);

export default IconWooperate;
