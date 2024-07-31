import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api.js';
import Container from '../container'; 
/**
 * Login component that provides a form for user authentication.
 */
const Login = () => {
  const navigate = useNavigate();

  /**
   * Handles the form submission for login.
   * @param {Object} values - Form data containing username and password.
   */
  const onFinish = async (values) => {
    try {
      const user = await loginUser(values);
      console.log('Login successful:', user);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Login successful!');
      navigate('/home'); //if Login successful then navigate to user home page
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed: Invalid username or password');
    }
  };

  return (
    <Container>
      <Card title="Login" style={{ width: 300, margin: 'auto', marginTop: 50 }}>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'username' }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'password' }]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              login
            </Button>
          </Form.Item>
          <Link to="/register">Register</Link>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
