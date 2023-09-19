import React from 'react';

import {Card} from 'react-bootstrap';

function InspectorCard  (props) {
    return (
        <div> 
            <Card className="d-flex flex-row border-0 bg-transparent">
                <Card.Img className="card-img-xs" src='https://cdn-icons-png.flaticon.com/512/21/21104.png' alt="img" />
                <Card.Body className="p-0 ms-3 align-self-center">
                    <img src='https://cdn-icons-png.flaticon.com/512/21/21104.png' ></img>
                    Inspector Martínez
                </Card.Body>
            </Card>
        </div>
    )
}

export default InspectorCard

