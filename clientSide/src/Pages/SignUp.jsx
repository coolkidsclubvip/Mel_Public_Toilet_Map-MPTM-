//React
import { useState } from "react";
//Bootstrap
import { Card, Form, Button, Alert } from "react-bootstrap";
//React Router
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//React Hook Forms
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
//Apollo Client
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphQL/mutations/mutations";

function SignUp({ onLogin }) {
  //JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });

  //React-Hook-Forms
  //control - React Hook Forms Controller this is used to control the input
  //handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  //formState - React Hook Forms formState this is used to access the form state
  //reset - React Hook Forms reset function this is used to reset the form
  //从返回的表单管理实例中提取了一些属性和函数，例如 control、handleSubmit、formState 和 reset。这些属性和函数用于管理表单字段的状态和行为。
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema), //resolver：使用Joi验证库来验证表单数据，将其与React Hook Form集成。defaultValues：设置表单字段的默认值。
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //?Apollo Client Mutation
  const [createUser, { loading, error }] = useMutation(CREATE_USER); //createUser - The mutation function 一个名为CREATE_USER的gql查询语句，放入useMutation钩子，得到一个createUser function
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Navigate function to navigate to a different page

  //?Submit New User
  //This function is called when the form is submitted by react hook forms
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    const { username, email, password } = data; // Destructure data from form

    try {
      // Send the mutation request with data as input 用集成了gql mutation语句的发射函数
      const result = await createUser({
        variables: {
          input: {
            username,
            email,
            password,
          },
        },
      });
      console.log(result.data); //Response from the server
      onLogin(result.data.createUser); // Call onLogin function with the user to be save to state and session storage????????????????????
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message); // Set error message state
    }
  };

  //Generates a random number that is used to select a background colour for the card component
  function getRandomNumber() {
    return Math.floor(Math.random() * 5);
  }
  //Generates a random emoji that is used to display a random emoji in the card component
  function getRandomPersonEmoji() {
    const personEmojis = ["👩", "👨", "🧑", "👧", "👦", "🚹", "♿"];
    const randomIndex = Math.floor(Math.random() * personEmojis.length);
    return personEmojis[randomIndex];
  }

  return (
    <Card className={`shadow m-3 bg-${getRandomNumber()}`}>
      <Card.Body>
        {/* Form Header */}
        <div className="d-flex mb-3">
          <div className="emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji">
            {getRandomPersonEmoji()}
          </div>
          <div className="title">
            <Card.Title className="bold text-white">Sign Up</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <i className="bi bi-calendar-event"></i>{" "}
              {new Date().toLocaleDateString()}
            </Card.Subtitle>
          </div>
        </div>
        {/* /Form Header */}
        {/* 使用了 noValidate 属性来阻止浏览器默认的表单验证 */}
        <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}>
          {/* onSubmit 是表单提交的事件处理程序，会在用户提交表单时触发。
handleSubmit 是React Hook Form提供的函数，它接受一个函数作为参数，并处理表单的提交逻辑。
handleSubmit(onSubmit) 中的 onSubmit 是你自己定义的函数，用于处理表单的实际提交操作。这个函数会在用户点击提交按钮后被调用。
当用户提交表单时，handleSubmit 将会执行以下操作：
阻止默认的表单提交行为，以防止页面刷新。
验证表单中的所有字段，包括验证规则（如必填、最小长度、格式等）。
如果表单验证通过，将会调用传递给 handleSubmit 的 onSubmit 函数，并将表单数据作为参数传递给它。
onSubmit 函数在内部使用了React Hook Form的 control 和其他功能，以便访问和处理表单字段的值、状态和错误消息。
总结起来，onSubmit={handleSubmit(onSubmit)} 这行代码将表单的提交事件与React Hook Form的表单验证和处理逻辑相关联。它确保在用户提交表单时，会触发正确的验证和处理函数，使得表单的数据能够被有效地验证和处理，而不会导致页面的刷新。这是React Hook Form的一个重要功能，可以简化表单的处理和验证流程。 */}

          {/* Email Text Box */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              // Bootstrap input text box component
              <Form.Group controlId="username">
                <Form.Label className="visually-hidden">Username</Form.Label>
                <Form.Control
                  {...field} // 将字段的值和事件处理程序绑定到输入元素
                  type="text"
                  placeholder="Username"
                  size="lg"
                  className="form-shadow mb-2"
                />
                {errors.username && (
                  <Alert variant="danger" className="mb-2 alert-dark mb-0">
                    {errors.username.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* /Email Text Box */}
          {/* Email Text Box */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              // Bootstrap input text box component
              <Form.Group controlId="email">
                <Form.Label className="visually-hidden">
                  Email address
                </Form.Label>
                <Form.Control
                  {...field}
                  type="email"
                  placeholder="Enter email"
                  size="lg"
                  className="form-shadow"
                />
                {errors.email && (
                  <Alert variant="danger" className="mt-2 alert-dark mb-0">
                    {errors.email.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* /Email Text Box */}
          {/* Password Text Box */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              // Bootstrap input text box component
              <Form.Group controlId="password" className="mt-2">
                <Form.Label className="visually-hidden">Password</Form.Label>
                <Form.Control
                  {...field}
                  type="password"
                  placeholder="Password"
                  size="lg"
                  className="form-shadow"
                />
                {errors.password && (
                  <Alert variant="danger" className="mt-2 alert-dark mb-0">
                    {errors.password.message}
                  </Alert>
                )}
              </Form.Group>
            )}
          />
          {/* /Password Text Box */}
          {/* General Error Messages */}
          {errorMessage && (
            <Alert variant="danger" className="mt-2 alert-dark mb-0">
              {errorMessage}
            </Alert>
          )}
          {/* General Error Messages */}
          {/* Submit Button */}
          <Button
            variant="dark"
            size="lg"
            block="true"
            className="w-100 mt-2"
            type="submit"
          >
            Login <i className="bi bi-send-fill"></i>
          </Button>
          {/* /Submit Button */}
        </Form>
        {/* Login Link */}
        <p className="m-0 mt-1">
          Already have an account? <Link to="/signup">Login</Link> now!
        </p>
        {/* Login Link */}
      </Card.Body>
    </Card>
  );
}
export default SignUp;
