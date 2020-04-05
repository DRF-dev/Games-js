import React from "react"
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
//import io from "socket.io-client"
import axios from 'axios'

import Navigation from "./props/Navigation"

interface lesStates {
    listeMessages: Array<any>,
    messageEnCours: string,
    pseudoEnCours: string,
}

export default class Chat extends React.Component<{},lesStates>{

    constructor(public props:any){
        super(props)
        this.state = {
            listeMessages: [],
            messageEnCours: "",
            pseudoEnCours: ""
        }
    }

    listeMessage = ()=>{        
        axios.get("http://localhost:4000/chat/all")
        .then(res=>{
            this.setState({
                ...this.state,
                listeMessages: res.data
            })
        })
    }

    componentDidMount = ()=>{
        this.listeMessage()
        /* const socket = io.connect("http://localhost:4000/")
        socket.on("listeMessage", (element:any)=>{ console.log(element)}) */
    }

    newMessage = (e:any)=>{
        e.preventDefault()
        if (this.state.messageEnCours !== '' && this.state.pseudoEnCours !== '') {
            const newMessage = {
                pseudo: this.state.pseudoEnCours,
                message: this.state.messageEnCours
            }
            this.setState({
                ...this.state,
                pseudoEnCours: "",
                messageEnCours: ""
            })
            axios.post("http://localhost:4000/chat/add", newMessage)
            .then(res=> {
                console.log(res.data.mess)
                this.listeMessage()
            })
            .catch(err=>console.log(err))
        }
    }

    render(){
        console.log(this.state)
        const {listeMessages, messageEnCours, pseudoEnCours} = this.state
        return(
            <Container fluid>
                <Navigation chat="active disabled" connexion="" inscription=""/>
                <Row>
                    <Col className="d-flex flex-column align-items-center">
                        <h1>Zone de chat</h1>
                        <div className="w-50">
                            <ul className="mt-5 mb-5">
                                {listeMessages.map(element=>{
                                    return <li key={element._id}><strong>{element.pseudo}</strong> : {element.message}</li>
                                })}
                            </ul>
                            <Form className="d-flex align-items-end" onSubmit={(e:any)=>this.newMessage(e)}>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Votre pseudo" onChange={(e:any)=>this.setState({...this.state, pseudoEnCours: e.target.value})} value={pseudoEnCours}/>
                                </Form.Group>
                                <Form.Group className="w-100">
                                    <Form.Control type="text" placeholder="Message"onChange={(e:any)=>this.setState({...this.state, messageEnCours: e.target.value})} value={messageEnCours}/>
                                </Form.Group>
                                <Form.Group>
                                    <Button type="submit" className="btn btn-success">Envoyer</Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}