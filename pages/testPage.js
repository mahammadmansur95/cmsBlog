import React,{useState} from 'react';
import { Button, Checkbox, Form, Input, Alert } from 'antd';

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const TestPage = () => {

  const [showSuccessComponent, setShowSuccessComponent] = useState(false);


  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      )
      .join('&');
  };

  const onFinish = (values) => {
    if (values[`bot-field`] === undefined) {
      delete values[`bot-field`]
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'mansur', ...values }),
    })
      .then(() => setShowSuccessComponent(true))
      .catch((error) => alert(error));
  };

  return (
    <>
      <div>testPage</div>
      {
        showSuccessComponent ? ( <Alert message="Its wonderful Mansur" type="success" />) : null
      }
      <form
        name='mansur'
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="username" />
        <input type="password" name="password" />
      </form>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        name="ddd"
        method="POST"
      >
        <Form.Item
          label="Don't fill this out"
          className={`hidden`}
          style={{ display: `none` }}
          name="bot-field"
        >
          <Input type={`hidden`} name="form-name" value="ddd" />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default TestPage;