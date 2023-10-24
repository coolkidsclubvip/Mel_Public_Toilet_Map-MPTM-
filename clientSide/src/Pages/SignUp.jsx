
//Bootstrap
import { Card, Form, Button, Alert } from "react-bootstrap";
//React Router
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//React Hook Forms
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
//Apollo Client
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphQL/mutations/mutations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/signUp.module.css";

function SignUp({ onLogin }) {
  //JOI Validation for React-Hook-Forms
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().required(),
  });

  //React-Hook-Forms

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema), //resolver: Use Joi validation library to validate form data, integrating it with React Hook Form. defaultValues: Set the default values of form fields.
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  //?Apollo Client Mutation
  const [createUser, { loading, error }] = useMutation(CREATE_USER); //createUser - The mutation function A gql query statement named CREATE_USER, put in the useMutation hook, and get a createUser function

  const navigate = useNavigate(); // Navigate function to navigate to a different page

  //Submit New User
  //This function is called when the form is submitted by react hook forms
  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevents page from refreshing on submit
    const { username, email, password, isAdmin } = data; // Destructure data from form

    try {
      // Send the mutation request with data as input using the launch function integrated with the gql mutation statement
      const result = await createUser({
        variables: {
          input: {
            username,
            email,
            password,
            isAdmin,
          },
        },
      });

      toast.success(`User ${username} is successfully registered`);
      onLogin(result.data.createUser); // Call onLogin function with the user to be save to state and session storage? ?
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={"d-flex shadow m-3 bg-1 mt-5 w-50 mx-auto"}>
        <Card.Body>
          {/* Form Header */}
          <div className="d-flex mb-3">
            <div className="emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji">
              {
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ color: " #0DBEE6" }}
                />
              }
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
          {/* The noValidate attribute is used to prevent the browser's default form validation*/}
          <Form noValidate="noValidate" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Text Box */}
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                // Bootstrap input text box component
                <Form.Group controlId="username">
                  <Form.Label className="visually-hidden">Username</Form.Label>
                  <Form.Control
                    {...field} // Bind the field's value and event handler to the input element
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
            {/* isAdmin radio box */}
            <Controller
              name="isAdmin"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="isAdmin" className="mt-2">
                  <Form.Label>Are you an admin?</Form.Label>
                  <div>
                    <Form.Check
                      {...field}
                      type="radio"
                      // id="isAdminTrue"
                      label="Yes"
                      value="true"
                      inline
                    />
                    <Form.Check
                      {...field}
                      type="radio"
                      // id="isAdminFalse"
                      label="No"
                      value="false"
                      inline
                    />
                  </div>
                  {errors.isAdmin && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.isAdmin.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            {/* Submit Button */}
            <Button
              variant="dark"
              size="lg"
              block="true"
              className="w-100 mt-2"
              type="submit"
            >
              Sign up <i className="bi bi-send-fill"></i>
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
    </div>
  );
}
export default SignUp;
