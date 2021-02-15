import React from 'react';

export default function Stat({ name, value, change }) {

    return (
        <div className="stat">
            <div className="stat-name">{name}</div>
            <div className="stat-value">{value}</div>
        </div>
    );
}