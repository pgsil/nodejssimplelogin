import React, { Component } from 'react';

export default class CompHeader extends Component {	
	constructor(props){
		super();	

		this.handleLogin = this.handleLogin.bind(this);
		this.handleProtected = this.handleProtected.bind(this);
		this.logOut = this.logOut.bind(this);

		this.state = {};
	}

	handleChange(event) {
		const 	target = event.target,
				value = target.value,
				name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleLogin(){
		fetch('/login', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    username: this.state.username,
		    password: this.state.password
		  })
		})
		.then((res) => res.json())		
		.then((json) => {
			alert("Successfully logged in.")
			console.log(json)
			window.localStorage.setItem("accesstoken", json.token);
			window.localStorage.setItem("tokenuser", json.user);
		})	
		.catch((error) => alert("ERROR: UNABLE TO LOG IN. CHECK USER/PASSWORD."))
	}

	handleProtected(){
		let token = window.localStorage.getItem("accesstoken");

		fetch('/protected', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'x-access-token': token
		  },
		  body: JSON.stringify({
		    user: window.localStorage.getItem("tokenuser")
		  })
		})
		.then((res) => res.json())
		.catch((error) => console.log("FETCH ERROR: " + error))
		.then((json) => {
			this.setState({message: JSON.parse(json).message});			
		})
	}

	logOut(){
		window.localStorage.removeItem("accesstoken");
		window.localStorage.removeItem("tokenuser");
	}

	render(){
		return (	
			<div>
				<div className="">Hello</div>	

				Valid logins: <br/>

				"username1", "password1",  <br/>
				"username2", "password2"

				<br/>

				<input type="text" name="username" onChange={this.handleChange.bind(this)} />
				<br/>
				<input type="text" name="password" onChange={this.handleChange.bind(this)} />

				<button onClick={this.handleLogin}>Log In</button>

				<br/>

				<button onClick={this.handleProtected}>Enter protected page</button>

				<br/>

				<span>{this.state.message ? this.state.message : null}</span>

				<br/>

				<button onClick={this.logOut}>Log out</button>
			</div>
		);
	}
}