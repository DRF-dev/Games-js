import React, { Props } from "react"
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import io from "socket.io-client"
import axios from 'axios'

import Navigation from "./props/Navigation"

interface lesStates {
    listeMessages: any,
    messageEnCours: string,
    pseudoEnCours: string,
}

let socket = io("http://localhost:4000")

export default class Chat extends React.Component<{},lesStates>{

    constructor(public props:Props<any>){
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
        .catch(err=>console.log(err))
    }

    componentDidMount = ()=>{
        this.listeMessage()
        socket.on("TempReel", (elm:{pseudo:string, message:string}) => {
            const newLine = document.createElement("li")
            newLine.innerHTML = `<strong>${elm.pseudo}</strong> : ${elm.message}`
            document.getElementsByTagName("ul")[1].appendChild(newLine)
        }) 
    }

    newMessage = (e:Event)=>{
        e.preventDefault()
        if (this.state.messageEnCours !== '' && this.state.pseudoEnCours !== '') {

            const newMessage = {
                pseudo: this.state.pseudoEnCours,
                message: this.state.messageEnCours
            }

            socket.emit("listeMessage", newMessage) 

            this.setState({
                ...this.state,
                pseudoEnCours: "",
                messageEnCours: ""
            })
            axios.post("http://localhost:4000/chat/add", newMessage)
            .then(res=> {
                console.log(res.data.mess)
            })
            .catch(err=>console.log(err))
        }
    }

    render(){
        const {listeMessages, messageEnCours, pseudoEnCours} = this.state
        console.log(this)
        return(
            <Container fluid>
                <Navigation chat="active disabled" connexion="" inscription=""/>
                <Row>
                    <Col className="d-flex flex-column align-items-center">
                        <h1>Zone de chat</h1>
                        <div className="w-50">
                            <ul className="mt-5 mb-5">
                                {listeMessages.map((element:{_id:any, pseudo:string, message:string})=>{
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