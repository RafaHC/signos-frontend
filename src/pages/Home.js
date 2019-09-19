import React, { Component } from 'react';
import './Home.css';
import api from './../services/api';
import socket from 'socket.io-client';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.usuario = this.props.location.state.usuario;
        this.state = {
                signos: [],
                nome: '',
                data_inicio: '',
                data_fim: '',
                descricao: '',
                usuarioid: this.usuario.id
        };
        api.defaults.headers.common['Authorization'] = `Bearer ${this.usuario.token}`;
    }

    async componentDidMount() {
        this.subscribeToEvent(); 
        this.getSignos();
    }

    async getSignos() {
        let response = await api.get(`signos/${this.usuario.id}`);
        this.setState({ signos: response.data });
    }

    registrar = async(e) => {
        e.preventDefault();
        if (this.state.nome === '' || this.state.data_inicio === '' || this.state.data_fim === '') return;
        if (this.state.data_fim < this.state.data_inicio){
            alert('Data final não pode ser menor que a data inicio');
        }
        let obj = {
            nome: this.state.nome,
            data_inicio : this.state.data_inicio.toString().replace('2019-', ''),
            data_fim: this.state.data_fim.toString().replace('2019-', ''),
            usuarioid: this.state.usuarioid
        }
        await api.post('signos',  obj);
    }

    subscribeToEvent = () => {
        const io = socket('http://localhost:4000/');
        io.on('signo', data => {
            this.setState({ signos: [data, ...this.state.signos] })
        })
    }

   render(){
       let deletarSigno = async (id) => {
           await api.delete(`signos/${id}`);
           this.getSignos();
       }

       let goToAscendente = (item) => {
           this.props.history.push('/ascendente', { signo: item, usuario: this.usuario });
       }

       return (
          
            <div>
               <button className="btn btn-danger" onClick={this.props.history.goBack}>Voltar</button>
               <h1>Signos</h1>
               <table className="table">
                   <thead>
                       <tr>
                           <th scope="col">Nome</th>
                           <th scope="col">Data Inicio</th>
                           <th scope="col">Data Fim</th>
                           <th scope="col">Ação</th>
                           <th scope="col">Ascendentes</th>
                       </tr>
                   </thead>
                   <tbody>
                       {this.state.signos.map(function (item, key) {
                           return (
                               <tr key={key}>
                                   <td>{item.nome}</td>
                                   <td>{item.data_inicio}</td>
                                       <td>{item.data_fim}</td>
                                   <td>
                                       <button type="button" id="delete" 
                                        onClick={
                                           async () => {
                                                deletarSigno(item.id);
                                           }
                                        } 
                                       className="btn btn-danger">Deletar</button>
                                   </td>
                                   <td>
                                       <button type="button" id="goToAscendente"
                                           onClick={
                                               async () => {
                                                   goToAscendente(item);
                                               }
                                           }
                                           className="btn btn-primary">Navegar</button>
                                   </td>
                               </tr>

                           )
                       })}
                  </tbody>     
                  </table>
                  <br></br>
                  <h2>Cadastro de Signos</h2>
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
                                type="date" className="form-control"
                                placeholder="Data inicial" id="data_inicio"
                                min="2019-01-01" max="2019-12-30"
                                onChange={e => this.setState({ data_inicio: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="date" className="form-control"
                                placeholder="Data final" id="data_fim"
                                min="2019-01-01" max="2019-12-30"
                                onChange={e => this.setState({ data_fim: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Cadastrar</button>
                   <hr />
               </form>
           </div>
       )
   }
}