import { useState } from "react";
import { Controller, useForm } from "react-hook-form"; //React Hook Form
import Joi from "joi"; //Joi Validation Library
import { joiResolver } from "@hookform/resolvers/joi"; //Joi Resolver for React Hook Form. - This is needed to use Joi with React Hook Form
// Apollo Client
import { useMutation, gql } from "@apollo/client"; //Apollo Client Hooks - useMutation
import { CREATE_TOILET_LOCATION } from "../graphQL/mutations/mutations"; //GraphQL Mutation
// React Bootstrap
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Alert,
  CloseButton,
} from "react-bootstrap";
import styles from "../styles/toiletEntry.module.css";
faToiletPaper;
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToiletPaper } from "@fortawesome/free-solid-svg-icons";

function ToiletEntry({ user, setShowEntry, refetch }) {
  // const userData = props.user; //User Data from App.js
  //Joi Validation
  const schema = Joi.object({
    name: Joi.string().min(3).max(300).required(),
    female: Joi.boolean().required(),
    male: Joi.boolean().required(),
    wheelchair: Joi.boolean().required(),
    baby_facil: Joi.boolean().required(),
    operator: Joi.string().min(3).max(300).required(),
    lon: Joi.number().required(),
    lat: Joi.number().required(),
  });

  //useForm
  //control - React Hook Forms Controller this is used to control the input
  //handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  //formState - React Hook Forms formState this is used to access the form state
  //reset - React Hook Forms reset function this is used to reset the form
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      name: "",
      female: false,
      male: false,
      wheelchair: false,
      baby_facil: false,
      operator: "",
    },
  });

  //GraphQL Mutation for creating a journal entry,createNewLocationGQL IS DOING THE HEAVY JOB!
  const [createNewLocationGQL] = useMutation(CREATE_TOILET_LOCATION, {
    //update the cache to add the new journal entry
    update(cache, { data: { createNewLocationGQL } }) {
      cache.modify({
        fields: {
          //add the new journal entry to the journalEntries array
          toiletLocations(existingLocations = []) {
            //create a new journal entry reference
            const newEntryRef = cache.writeFragment({
              data: createNewLocationGQL,
              fragment: gql`
                fragment NewToiletLocation on ToiletLocation {
                  id
                  name
                  female
                  male
                  wheelchair
                  operator
                  baby_facil
                  lon
                  lat
                }
              `,
            });
            //return the new journal entry reference and the existing journal entries
            return [...existingLocations, newEntryRef];
          },
        },
      });
    },
  });

  //This function is used to create a journal entry, 只是封装，传递数据靠createNewLocationGQL完成
  const createNewLocation = async (data, token) => {
    //Destructure the data object
    const { name, female, male, wheelchair, operator, baby_facil, lon, lat } =
      data;

    try {
      //Send the mutation request with data as input
      const result = await createNewLocationGQL({
        variables: {
          input: {
            name,
            female,
            male,
            wheelchair,
            operator,
            baby_facil,
            lon,
            lat,
          },
        },
        context: {
          headers: {
            authorization: `${token}`,
          },
        },
      });
      console.log("result: ", result);

      toast.success("New location has been created");
    } catch (error) {
      console.error(error.message);
      toast.error("New location creation failed: " + error.message); ///why error shows????????????????????????????????????????
    }
  };

  //onSubmit callback function
  const onSubmit = async (data) => {
    const { name, female, male, wheelchair, operator, baby_facil, lon, lat } =
      data; //Destructure the data object, from hook from?

    const token = user.token; //Get the token from the user data
    await createNewLocation(
      { name, female, male, wheelchair, operator, baby_facil, lon, lat },
      token
    ); //Call the createNewLocation function and pass in the data object and the token
    refetch();
    reset();
    setShowEntry(false);
  };

  return (
    <Card className="shadow text-white m-3 bg-1 w-50 mx-auto">
      <Card.Body>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex align-items-center">
            <div className="emoji  rounded-circle inner-shadow-emoji-large">
              <FontAwesomeIcon
                icon={faToiletPaper}
                size="sm"
                style={{ color: "white" }}
              />
            </div>
            <div className="w-75 mx-auto ms-3">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter name"
                    className="bold mb-2 w-100 form-shadow"
                    size="lg"
                  />
                )}
              />
            </div>
            <div className="display-6 mb-5" onClick={() => setShowEntry(false)}>
              <CloseButton />
            </div>
          </div>
          {errors.name && (
            <Alert variant="dark" className="mb-2 mb-0">
              {errors.name.message}
            </Alert>
          )}

          <div className="d-flex align-items-center">
            <div className="w-75 mx-auto">
              <Controller
                name="operator"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter operator"
                    className="bold mb-2 form-shadow"
                    size="lg"
                  />
                )}
              />
            </div>
          </div>
          {errors.operator && (
            <Alert variant="dark" className="mb-2 mb-0">
              {errors.operator.message}
            </Alert>
          )}

          <div className="d-flex justify-content-between">
            {/* latititude enter */}
            <div className="w-25 mx-auto mt-2">
              <Controller
                name="lat"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter lat"
                    className="bold mb-2 form-shadow"
                    size="lg"
                  />
                )}
              />
            </div>
            {/* Lontitutde enter */}
            <div className="w-25 mx-auto mt-2">
              <Controller
                name="lon"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter lon"
                    className="bold mb-2 form-shadow"
                    size="lg"
                  />
                )}
              />
            </div>
          </div>
          {errors.lon && (
            <Alert variant="dark" className="mt-2 mb-0">
              {errors.lon.message}
            </Alert>
          )}
          {errors.lat && (
            <Alert variant="dark" className="mt-2 mb-0">
              {errors.lat.message}
            </Alert>
          )}

          <div className="d-flex justify-content-between mt-2">
            <Controller
              name="male"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="male" className="mt-2">
                  <Form.Label>Male toilet</Form.Label>
                  <div>
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Yes"
                      value="true"
                      inline
                    />
                    <Form.Check
                      {...field}
                      type="radio"
                      label="No"
                      value="false"
                      inline
                    />
                  </div>
                  {errors.male && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.male.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />

            <Controller
              name="female"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="female" className="mt-2">
                  <Form.Label>Female toilet</Form.Label>
                  <div>
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Yes"
                      value="true"
                      inline
                    />
                    <Form.Check
                      {...field}
                      type="radio"
                      label="No"
                      value="false"
                      inline
                    />
                  </div>
                  {errors.female && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.female.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />
            <Controller
              name="baby_facil"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="baby_facil" className="mt-2">
                  <Form.Label>Baby Facility</Form.Label>
                  <div>
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Yes"
                      value="true"
                      inline
                    />
                    <Form.Check
                      {...field}
                      type="radio"
                      label="No"
                      value="false"
                      inline
                    />
                  </div>
                  {errors.baby_facil && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.baby_facil.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />
            <Controller
              name="wheelchair"
              control={control}
              render={({ field }) => (
                <Form.Group controlId="wheelchair" className="mt-2">
                  <Form.Label>Wheelchair accessible</Form.Label>
                  <div>
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Yes"
                      value="true"
                      inline
                    />
                    <Form.Check
                      {...field}
                      type="radio"
                      label="No"
                      value="false"
                      inline
                    />
                  </div>
                  {errors.wheelchair && (
                    <Alert variant="danger" className="mt-2 alert-dark mb-0">
                      {errors.wheelchair.message}
                    </Alert>
                  )}
                </Form.Group>
              )}
            />
          </div>
          {/* Submit Button */}
          <Button
            variant="dark"
            size="lg"
            block="true"
            className="w-100 mt-5"
            type="submit"
          >
            Create <i className="bi bi-send-fill"></i>
          </Button>
          {/* Submit Button */}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ToiletEntry;
