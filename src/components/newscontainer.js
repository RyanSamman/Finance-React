import React from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";

const newsContainer = (props) => {
    return ( <
        div >
        <
        card >
        <
        CardImg top width = "100%"
        src = "https://www.shutterstock.com/nb/image-photo/forex-finance-economy-invest-illustration-concept-762360604"
        alt = "Card image cap" / >
        <
        CardBody >
        <
        CardTitle > $ { News } < /CardTitle> <
        CardSubtitle > $ { NewsSubtitle } < /CardSubtitle> <
        CardText > $ { NewsText } < /CardText> <
        /CardBody> <
        /card> <
        /div>
    )
};