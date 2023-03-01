import { useState } from "react";
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button, Checkbox, Form, Input,Alert } from 'antd';

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function Home({ blogs }) {
  const emailRegex = /^\S+@\S+\.\S+$/;
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
      body: encode({ 'form-name': 'contact', ...values }),
    })
      .then(() => setShowSuccessComponent(true))
      .catch((error) => alert(error));
  };


  return (
    <div className={styles["container"]}>
      <Head>
        <title>Demo Blog</title>
      </Head>
      <h1 className={styles["header"]}>Welcome to my blog</h1>
      <div>Mansur</div>
      <p className={styles["subtitle"]}>
        This is a subtitle idk what to type here
      </p>
      <ul className={styles["blog-list"]}>
        {blogs.map((blog, id) => (
          <li key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              {blog.date}:{blog.title}
            </Link>
          </li>
        ))}
      </ul>

      {
        showSuccessComponent ? (
          <Alert message="Success Text" type="success" />
        ) : null
      }

      <form
        name='contact'
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
        name="fff"
        method="POST"
      >
        <Form.Item
          label="Don't fill this out"
          className={`hidden`}
          style={{ display: `none` }}
          name="bot-field"
        >
          <Input type={`hidden`} name="form-name" value="fff" />
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
    </div>
  );
}

export async function getStaticProps() {
  // List of files in blgos folder
  const filesInBlogs = fs.readdirSync("./content/blogs");
  console.log("test", filesInBlogs);

  // Get the front matter and slug (the filename without .md) of all files
  const blogs = filesInBlogs.map((filename) => {
    const file = fs.readFileSync(`./content/blogs/${filename}`, "utf8");
    const matterData = matter(file);
    console.log("matterData", matterData);

    return {
      ...matterData.data, // matterData.data contains front matter
      slug: filename.slice(0, filename.indexOf(".")),
    };
  });

  console.log("blogs", blogs);

  return {
    props: {
      blogs,
    },
  };
}
