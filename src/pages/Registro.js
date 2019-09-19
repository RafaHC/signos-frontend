
import React, { Component } from 'react';
import './Login.css';
import api from './../services/api';

export default class Registro extends Component {
    state = {
        usuario: "",
        email: "",
        senha: ""
    };

    registrar = async (e) => {
        e.preventDefault();
        if (this.state.usuario === "" || this.state.senha === "") return;
        let result = await api.post('usuarios', this.state);
            console.log(result);
            this.props.history.push('/');
    };
    render() {
        return (
            <div className="login-wrapper">
                <button className="btn btn-danger" onClick={this.props.history.goBack}>Voltar</button>
                <h2>Cadastro de Usuário</h2>
                <form onSubmit={this.registrar}>
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
                            type="email" className="form-control"
                            placeholder="email" id="email"
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password" className="form-control"
                            placeholder="Senha" id="senha"
                            onChange={e => this.setState({ senha: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Cadastrar</button>
                    <hr />
                </form>
            </div>
        );
    }
}
