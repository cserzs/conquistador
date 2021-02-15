import React from 'react';

export default function ConquerButton({visible, caption, click}) {

    return (
        <>
        {visible &&
            <div className="button-container">            
                <button className="button2" onClick={click}>{caption}</button>
            </div>
        }
        </>
    );
}