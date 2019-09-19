import React, { Component } from 'react';
import './Ascendente.css';
import api from './../services/api';
import socket from 'socket.io-client';

export default class Ascendente extends Component {

    constructor(props) {
        super(props);
        this.usuario = this.props.location.state.usuario;
        this.signo = this.props.location.state.signo;
        this.state = {
            ascendentes: [],
            nome: '',
            hora_inicio: '',
            hora_fim: '',
            descricao: '',
            signoid: this.signo.id
        };
        api.defaults.headers.common['Authorization'] = `Bearer ${this.usuario.token}`;
    }

    async componentDidMount() {
        this.subscribeToEvent();
        this.getAscendentes();
    }

    subscribeToEvent = () => {
        const io = socket('http://localhost:4000/');
        io.on('ascendente', data => {
            this.setState({ ascendentes: [data, ...this.state.ascendentes] })
        })
    }

    registrar = async (e) => {
        e.preventDefault();
        if(this.state.hora_fim < this.state.hora_inicio){
            alert('Hora final não pode ser menor que a hora inicial');
            return;
        } 
        if (this.state.nome === '' || this.state.hora_inicio === '' || this.state.hora_fim === '') return;
        let obj = {
            nome: this.state.nome,
            hora_inicio: this.state.hora_inicio,
            hora_fim: this.state.hora_fim,
            signoid: this.state.signoid
        }
        await api.post('ascendentes', obj);
    }

    async getAscendentes() {
        let response = await api.get(`ascendentes/${this.signo.id}`);
        this.setState({ ascendentes: response.data });
    }

    render(){
        let deletarAscendente = async (id) => {
            await api.delete(`ascendentes/${id}`);
            this.getAscendentes();
        }

        return (

            <div>
                <button className="btn btn-danger" onClick={this.props.history.goBack}>Voltar</button>
                <h1>Ascendentes</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Hora Inicio</th>
                            <th scope="col">Hora Fim</th>
                            <th scope="col">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.ascendentes.map(function (item, key) {
                            return (
                                <tr key={key}>
                                    <td>{item.nome}</td>
                                    <td>{item.hora_inicio}</td>
                                    <td>{item.hora_fim}</td>
                                    <td>
                                        <button type="button" id="delete"
                                            onClick={
                                                async () => {
                                                    deletarAscendente(item.id);
                                                }
                                            }
                                            className="btn btn-danger">Deletar</button>
                                    </td>
                                    
                                </tr>

                            )
                        })}
                    </tbody>
                </table>
                <br></br>
                <h2>Cadastro de Ascendentes</h2>
                <form onSubmit={this.registrar}>
                    <div className="form-group">
                        <input className="form-control"
                            type="text" id="usuario"
                            placeholder="Nome de usuário"
                            onChange={e => this.setState({ nome: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="time" className="form-control"
                            placeholder="Hora inicial" id="hora_inicio"
                            onChange={e => this.setState({ hora_inicio: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="time" className="form-control"
                            placeholder="Hora final" id="hora_fim"
                            onChange={e => this.setState({ hora_fim: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Cadastrar</button>
                    <hr />
                </form>
            </div>
        )
    }

}

