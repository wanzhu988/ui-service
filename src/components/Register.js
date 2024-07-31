import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api.js';
import Container from '../container'; 
/**
 * Register component that provides a form for new user registration.
 */
const Register = () => {
    const navigate = useNavigate();

    /**
     * Handles the form submission for registration.
     * @param {Object} values - Form data containing username, password.
     */
    const onFinish = async (values) => {
      try {
        const user = await registerUser(values);
        console.log('Registration successful:', user);
        message.success('Registration successful!');
        navigate('/login');  // If Registration successful then navigate to login page
      } catch (error) {
        console.error('Registration failed:', error);
        message.error('Registration failed!');
      }
    };
  return (
    <Container>
      <Card title="Registration" style={{ width: 300, margin: 'auto', marginTop: 50 }}>
        <Form
          name="register"
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
              Registration
            </Button>
          </Form.Item>
          <Link to="/login">Login</Link>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
