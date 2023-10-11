//React
import { Controller, useForm } from "react-hook-form"; // React Hook Forms
import Joi from "joi"; // Joi Validation
import { joiResolver } from "@hookform/resolvers/joi"; // Joi Resolver for React Hook Forms
import { Link, useNavigate } from "react-router-dom"; // React Router
//React Bootstrap
import { Card, Form, Button, Alert } from "react-bootstrap";
//Apollo Client
import { useMutation } from "@apollo/client";
//GraphQL Mutations
import { LOGIN_USER } from "../graphQL/mutations/mutations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import styles from "../styles/login.module.css";

function Login({ onLogin }) {
  // JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
  });

  // React-Hook-Forms
  // control - React Hook Forms Controller this is used to control the input
  // handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  // formState - React Hook Forms formState this is used to access the form state
  // reset - React Hook Forms reset function this is used to reset the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER); // loginUser - The mutation function

  const navigate = useNavigate(); // Navigate function to navigate to a different page

  // Submit Login
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    const { email, password } = data; // Destructure data from form
    try {
      // Send the mutation request with data as input
      const result = await loginUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      console.log("result.data is: ", result.data);
           toast.success(`Welcome back, ${result.data.loginUser.username}`);
      onLogin(result.data.loginUser); // Call onLogin function from App.jsx to store the user in App.jsx state
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log(error.message);
      reset(); // Reset the form
    }
  };

  

  return (
    <div className={styles.container}>
    <Card className={"shadow m-3 mt-5 bg-3 w-50 mx-auto"}>
      <Card.Body>
        {/* Form Header */}
        <div className="d-flex mb-3">
          <div className="emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji">
            <FontAwesomeIcon
              icon={faRightToBracket}
              style={{ color: "#C37700" }}
            />
          </div>
          <div className="title">
            <Card.Title className="bold text-white">Login</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <i className="bi bi-calendar-event"></i>{" "}
              {new Date().toLocaleDateString()}
            </Card.Subtitle>
          </div>
        </div>
        {/* /Form Header */}
        <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}>
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
          {/* {errorMessage && (
            <Alert variant="danger" className="mt-2 alert-dark mb-0">
              {errorMessage}
            </Alert>
          )} */}
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
          {/* Sign Up Link */}
          <p className="m-0 mt-1">
            Don't have an account? <Link to="/signup">Sign up</Link> now!
          </p>
          {/* /Sign Up Link */}
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
}

export default Login;
