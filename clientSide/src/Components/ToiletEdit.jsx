//React
import { useEffect } from "react"; // useEffect hook
import { Controller, useForm } from "react-hook-form"; // React Hook Forms
import Joi from "joi"; // Joi Validation
import { joiResolver } from "@hookform/resolvers/joi"; // Joi Resolver for React Hook Forms
import {  useNavigate } from "react-router-dom"; // React Router
//Apollo Client
import { useMutation, useQuery } from "@apollo/client"; // Apollo Client Hooks - useMutation
import { GET_TOILET_LOCATION } from "../graphQL/queries/queries"; // GraphQL Query
import { UPDATE_TOILET_LOCATION } from "../graphQL/mutations/mutations"; // GraphQL Mutation
//React Bootstrap
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Alert,
  CloseButton,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPooStorm } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/toiletEdit.module.css";

function ToiletEdit({ user, setShowEdit, refetch, toiletLocationId }) {
  // const { toiletLocationId } = useParams(); // Get the location id from the url
  const navigate = useNavigate(); // Navigate function to navigate to a different page

  // GraphQL Query to get the location
  // GET_JOURNAL_ENTRY - GraphQL Query
  // toiletLocationId- The id of the location to get
  // user.token - The token from the user data
  const { loading, error, data } = useQuery(GET_TOILET_LOCATION, {
    variables: { toiletLocationId },
    context: {
      headers: {
        authorization: `${user.token}`,
      },
    },
  });

  // GraphQL Mutation for updating a location
  const [updateToiletLocationGQL] = useMutation(UPDATE_TOILET_LOCATION, {
    // update the cache to update the journal entry
    update(cache, { data: { updateToiletLocationGQL } }) {
      // read the journal entry from the cache
      const { toiletLocation } = cache.readQuery({
        query: GET_TOILET_LOCATION,
        variables: { id: toiletLocationId },
      }) || { toiletLocation: null };
      // write the updated journal entry to the cache
      if (toiletLocation) {
        // write the updated journal entry to the cache
        cache.writeQuery({
          query: GET_TOILET_LOCATION,
          variables: { id: toiletLocationId },
          data: {
            toiletLocation: {
              ...toiletLocation,
              ...updateToiletLocationGQL,
            },
          },
        });
      }
    },
  });

 

  // onSubmit - Called when the form is submitted
  const onSubmit = async (formData) => {
    const { name, female, male, wheelchair, operator, baby_facil, lon, lat } =
      formData;

    try {
      // update the toilet location
      await updateToiletLocationGQL({
        variables: {
          updateToiletLocationId: toiletLocationId,
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
            authorization: `${user.token}`,
          },
        },
      });
      // redirect to toilet location page
      toast.success("Location has been updated successfully");
      setShowEdit(false);
      refetch()
      navigate("/");
    } catch (error) {
      toast.error(`Failed to update location: ${error.message}`);
    }
  };

  // JOI Validation for React-Hook-Forms, updated content can be empty
  const schema = Joi.object({
    name: Joi.string().min(3).max(300),
    female: Joi.boolean(),
    male: Joi.boolean(),
    wheelchair: Joi.boolean(),
    baby_facil: Joi.boolean(),
    operator: Joi.string().min(3).max(300),
    lon: Joi.number(),
    lat: Joi.number(),
  });
  // React-Hook-Forms
  // control - React Hook Forms Controller this is used to control the input
  // watch - React Hook Forms watch function this is used to watch an input
  // handleSubmit - React Hook Forms handleSubmit function this is used to handle the submit event
  // setValue - React Hook Forms setValue function this is used to set the value of an input
  // formState - React Hook Forms formState this is used to access the form state
  // resolver - React Hook Forms resolver this is used to validate the form
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  // //I need this as the mood loads in a few secs after the page loads and I need to set the value of the mood to the current mood
  // useEffect(() => {
  //   if (data) {
  //     setValue("mood", data.journalEntry.mood);
  //   }
  // }, [data]);

  // if (loading) return <p>Loading... 🤔</p>;
  // if (error) return <p>Error 😭</p>;

  return (
    <div className={styles.wrapper}>
      <Card className="shadow text-white bg-2 w-50 mx-auto">
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex align-items-center">
              <div className=" rounded-circle p-0 inner-shadow-emoji-large">
                <FontAwesomeIcon
                  icon={faPooStorm}
                  size="sm"
                  style={{ color: "white" }}
                />
              </div>
              <div className="w-75 ms-3 ">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      defaultValue={""}
                      placeholder="Enter new name"
                      className="bold mb-2 w-100 form-shadow"
                      size="lg"
                    />
                  )}
                />
              </div>
              <div
                className="display-6 mb-5 ms-5"
                onClick={() => setShowEdit(false)}
              >
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
                      placeholder="Enter new operator"
                      defaultValue={""}
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
                      placeholder="Enter new lon"
                      className="bold mb-2 form-shadow"
                      size="lg"
                    />
                  )}
                />
              </div>
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
                      placeholder="Enter new lat"
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

            <div className="d-flex justify-content-between">
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
              Update <i className="bi bi-send-fill"></i>
            </Button>
            {/* Submit Button */}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ToiletEdit;
