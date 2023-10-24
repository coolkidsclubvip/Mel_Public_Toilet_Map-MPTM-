import { Controller, useForm } from "react-hook-form"; //import React Hook Form
import Joi from "joi"; //Joi Validation Library
import { joiResolver } from "@hookform/resolvers/joi"; //import Joi Resolver for React Hook Form. - This is needed to use Joi with React Hook Form
// Apollo Client
import { useMutation} from "@apollo/client"; //import Apollo Client Hooks - useMutation
import { CREATE_TOILET_LOCATION } from "../graphQL/mutations/mutations"; //import GraphQL Mutation
// React Bootstrap
import { Card, Form, Button, Alert, CloseButton } from "react-bootstrap"; // import react-bootstrap page components

import { toast } from "react-toastify"; //import toastify component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // import FontAwesomeIcon component
import { faToiletPaper } from "@fortawesome/free-solid-svg-icons"; // import icon from fortawesome

function ToiletEntry({ user, setShowEntry, refetch }) {
  // destructure props passed from ToiletLocation.jsx

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

  //GraphQL Mutation for creating a new toilet location,createNewLocationGQL IS DOING THE HEAVY JOB!
  const [createNewLocationGQL] = useMutation(CREATE_TOILET_LOCATION, 
  //   {
  //   //update the cache to add the new location
  //   update(cache, { data: { createNewLocationGQL } }) {
  //     cache.modify({
  //       fields: {
  //         //add the new location to the locations array
  //         toiletLocations(existingLocations = []) {
  //           //create a new location reference
  //           const newEntryRef = cache.writeFragment({
  //             data: createNewLocationGQL,
  //             fragment: gql`
  //               fragment NewToiletLocation on ToiletLocation {
  //                 id
  //                 name
  //                 female
  //                 male
  //                 wheelchair
  //                 operator
  //                 baby_facil
  //                 lon
  //                 lat
  //               }
  //             `,
  //           });
  //           //return the new location reference and the existing locations
  //           return [...existingLocations, newEntryRef];
  //         },
  //       },
  //     });
  //   },
  // }
  );

  //This function is used to create a new location, (ONLY for encapsulation，data transfer is done by createNewLocationGQL function)
  const createNewLocation = async (data, token) => {
    // data, token parameters are passed in at onSubmit function below
    //Destructure the data object
    const { name, female, male, wheelchair, operator, baby_facil, lon, lat } =
      data;
console.log("data is :",data);
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
        //create a context contains token as auth in request header
        context: {
          headers: {
            authorization: `${token}`,
          },
        },
      });
      console.log("result in is: ", result);
      toast.success("New location has been created"); // success message

      return result; // no difference?
    } catch (error) {
      console.error(error);
      toast.error("New location creation failed: " + error.message); ///why error shows???????? Cache saving causes errors
    }
  };

  //onSubmit callback function
  const onSubmit = async (data) => {
    const { name, female, male, wheelchair, operator, baby_facil, lon, lat } =
      data; //Destructure the data object, passed in from hook from.

    const token = user.token; //Get the token from the user data
    const resultxx= await createNewLocation(
      { name, female, male, wheelchair, operator, baby_facil, lon, lat },
      token
    ); 
    console.log("resultxx", resultxx); //undefined
    
    //Call the createNewLocation function and pass in the data object and the token
    refetch(); // refetch data from the DB after mutation
    reset(); // reset the form
    setShowEntry(false); // close the entry form when creation complete
  };

  return (
    // New location creation card starts
    <Card className="shadow text-white m-3 bg-1 w-50 mx-auto">
      <Card.Body>
        {/* React hook form */}
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
              {/* controlled input */}
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
            {/* CloseButton component from Bootstrap */}
            <div className="display-6 mb-5" onClick={() => setShowEntry(false)}>
              <CloseButton />
            </div>
          </div>
          {/* if error exists, show Alert component from Bootstrap */}
          {errors.name && (
            <Alert variant="dark" className="mb-2 mb-0">
              {errors.name.message}
            </Alert>
          )}

          <div className="d-flex align-items-center">
            <div className="w-75 mx-auto">
              {/* controlled input */}
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
          {/* if error exists, show Alert component from Bootstrap */}
          {errors.operator && (
            <Alert variant="dark" className="mb-2 mb-0">
              {errors.operator.message}
            </Alert>
          )}

          <div className="d-flex justify-content-between">
            {/* Latititude enter */}
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
          {/* if error exists, show Alert component from Bootstrap */}
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
                  {/* if error exists, show Alert component from Bootstrap */}
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
                  {/* if error exists, show Alert component from Bootstrap */}
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
                  {/* if error exists, show Alert component from Bootstrap */}
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
