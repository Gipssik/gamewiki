import React from 'react';
import styles from "./SignUpPage.module.css";
import {Button, Form, Input, Modal} from "antd";
import {Navigate, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../store";
import {ApiError, UserCreate, UsersService} from "../../client";

const SignUpPage: React.FC = () => {
	const navigate = useNavigate()
	const isAuth = useAppSelector(s => s.auth.isAuth)

	const register = (values: UserCreate) => {
		UsersService.create(values)
			.then(user => {
				Modal.success({
					closable: true,
					title: "Success!",
					content: `User ${values.username} was created successfully!`
				})
				navigate('/sign-in')
			})
			.catch((error: ApiError) => {
				Modal.error({
					closable: true,
					title: "Error",
					content:
						error.body.detail
							.replaceAll('(', '')
							.replaceAll(')', '')
							.replaceAll('=', ' ')
				})
			})
	}

	if (isAuth)
		return <Navigate to="/account" replace/>

	return (
		<div className={styles.container}>
			<h1>Sign Up</h1>
			<Form
				name="basic"
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 16,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={register}
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
							pattern: /^\w+$/,
							message: "Username must contain only letters, numbers and underscore sign"
						}
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "You have to provide your username",
						},
						{
							type: "email",
							message: "You have to provide a valid email"
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
						Sign Up
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SignUpPage;