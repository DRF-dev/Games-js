import React from 'react'
import { Container, Row, Col} from "react-bootstrap"

class NotFound extends React.Component{
    render(){
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Error 404, page not found</h1>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default NotFound