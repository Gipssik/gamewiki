import React from 'react';
import {Button, Divider, Form, Input, Modal} from 'antd';
import styles from './SignInPage.module.css'
import {AuthService, Body_auth_login_access_token, UsersService} from "../../client";
import {authActions, useAppDispatch, useAppSelector} from "../../store";
import {Navigate} from "react-router-dom";

type Credentials = {
	username: string,
	password: string
}

const SignInPage = () => {
	const dispatch = useAppDispatch()
	const isAuth = useAppSelector(s => s.auth.isAuth)

	const login = (values: Credentials) => {
		const data = values as Body_auth_login_access_token
		AuthService.loginAccessToken(data)
			.then(response => {
				localStorage.setItem('accessToken', response.access_token)
				UsersService.getMe()
					.then(user => {
						dispatch(authActions.login({user}))
					})
			})
			.catch(error => {
				Modal.error({
					closable: true,
					title: 'Authentication error',
					content: 'Incorrect username or password',
				});
			})
	};

	if (isAuth)
		return <Navigate to="/account" replace/>

	return (
		<div className={styles.container}>
			<h1>Sign In</h1>
			<Divider/>
			<Form
				name="basic"
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 16,
				}}
				onFinish={login}
				autoComplete="off"
			>
				<Form.Item
					label="Username"
					name="username"
					rules={[
						{
							required: true,
							message: "You have to provide your username",
						},
						{
							min: 4,
							message: "Username must be at least 4 characters long"
						},
						{
							max: 20,
							message: "Username must be maximum 20 characters long"
						},
						{
							pattern: /^\w+$/,
							message: "Username must contain only letters, numbers and underscore sign"
						}
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: 'You have to provide your password',
						},
						{
							min: 8,
							message: 'Password must be at least 8 characters long'
						}
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 10,
						span: 8,
					}}
				>
					<Button type="primary" htmlType="submit">
						Sign In
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SignInPage;