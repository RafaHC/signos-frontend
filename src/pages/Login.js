
import React, { Component } from 'react';
import './Login.css';
import api from './../services/api';

export default class Login extends Component {
    state = {
        usuario: "",
        senha: ""
    };

    login = async (e) => {
        e.preventDefault();
        if (this.state.usuario === "" || this.state.senha === "") return;
        let result = await api.post('login', this.state);
        result = JSON.parse(JSON.stringify(result));
        if(result.data.nome && result.data.token){
            let obj = {
                id: result.data.id,
                usuario: result.data.nome,
                token: result.data.token
            }

            this.props.history.push('/home', { usuario: obj });
            
        }else{
        }
    };

    registrarUsuario = async () => {
        this.props.history.push('/registro');
    }

    render() {
        return (
            <div className="login-wrapper">
                <h1>App dos Signos</h1>
                <form onSubmit={this.login}>
                    {this.state.error && <p>{this.state.error}</p>}
                        <div className="form-group">
                                <input className="form-control"
                                    type="text" id="usuario"
                                    placeholder="Nome de usuário"
                                    onChange={e => this.setState({ usuario: e.target.value })}
                                />
                        </div>
                        <div className="form-group">
                            <input
                                type="password" className="form-control"
                                placeholder="Senha" id="senha"
                                onChange={e => this.setState({ senha: e.target.value })}
                            />
                        </div>
                    
                        <button type="submit" className="btn btn-primary">Entrar</button>
                    <button type="button" id="registro" onClick={this.registrarUsuario} className="btn btn-secundary">Registrar-se</button>
                    <hr />
                </form>
            </div>
        );
    }
}
