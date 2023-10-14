// const ToiletLocation = require("./toiletLocations-type")
const ToiletLocationsModel = require("../../models/toiletLocations");
const { validateToiletLocation } = require("../../helpers/joi");
const { GraphQLError } = require("graphql");
const { isAuthenticated, isAuthorized } = require("../../helpers/auth");

const toiletLocationResolver = {
  Query: {
    toiletLocations: async (parent, args, context) => {
      const toiletLocations = await ToiletLocationsModel.find();
      return toiletLocations;
    },

    toiletLocationByName: async (parent, args, context) => {
      // Option 1: Search by input name string
      console.log("args is:", args);
      try {
        const regex = new RegExp(args.name, "i"); // "i" Ignore case

        const toiletLocations = await ToiletLocationsModel.find({
          name: { $regex: regex },
        });

        if (!toiletLocations || toiletLocations.length === 0) {
          throw new Error("Toilet locations not found");
        }

        return toiletLocations;
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: "FIND_TOILET_LOCATION_ERROR",
          },
        });
      }
    },

    // Option2: Search by input ID
    toiletLocation: async (parent, args, context) => {
      try {
        const toiletLocation = await ToiletLocationsModel.findById(args.id);
        if (!toiletLocation) {
          throw new Error("Toilet can not be found");
        }
        return toiletLocation;
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: "FIND_TOILET_LOCATION_ERROR",
          },
        });
      }
    },
  },

  Mutation: {
    createToiletLocation: async (parent, args, context) => {
      try {
        console.log("args.input is:", args.input);
        // Check if the user is authorized (isAdmin true) to edit the journal entry
        isAuthorized(context);

        // Validate the input data
        const { error } = validateToiletLocation(args.input);

        if (error) throw new Error(error.details[0].message);

        // Create a new jlocation using the input data (a neater approach than Dna's, use when require no middle manipulation)
        const toiletLocation = new ToiletLocationsModel(args.input);
        console.log("toiletLocation is:", toiletLocation);
        // Save the new location entry to the database
        return await toiletLocation.save();
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: "ADD_TOILET_LOCATION_ERROR",
          },
        });
      }
    },

    updateToiletLocation: async (parent, args, context) => {
      console.log("args is", args);
      try {
        // Check if the user is authenticated

        isAuthenticated(context);
        // Find the toilet location to be updated by its ID
        const toiletLocation = await ToiletLocationsModel.findById(args.id);
        if (!toiletLocation) {
          throw new Error("invalid toilet location ID");
        }
        // Check if the user is authorized to edit the toilet details(excludes location)
        isAuthorized(context);

        //
        if (!args){return}
        // Update can accept null values, and ONLY UPDATE WHAT'S NOT NULL!!
        if (args.input.name !== null && args.input.name !== undefined) {
          toiletLocation.name = args.input.name;
        }
        if (args.input.female !== null && args.input.female !== undefined) {
          toiletLocation.female = args.input.female;
        }
        if (args.input.male !== null && args.input.male !== undefined) {
          toiletLocation.male = args.input.male;
        }
        if (args.input.wheelchair !== null && args.input.wheelchair !== undefined) {
          toiletLocation.wheelchair = args.input.wheelchair;
        }
        if (args.input.operator !== null && args.input.operator !== undefined) {
          toiletLocation.operator = args.input.operator;
        }
        if (args.input.baby_facil !== null && args.input.baby_facil !== undefined) {
          toiletLocation.baby_facil = args.input.baby_facil;
        }
        if (args.input.lon !== null && args.input.lon !== undefined) {
          toiletLocation.lon = args.input.lon;
        }
        if (args.input.lat !== null && args.input.lat !== undefined) {
          toiletLocation.lat = args.input.lat;
        }

        // No need to update location, location can not change!

        // Save the updated journal entry to the database
        return await toiletLocation.save();
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: "UPDATE_TOILET_LOCATION_ERROR",
          },
        });
      }
    },

    deleteToiletLocation: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the toilet location to delete by its ID
        const toiletLocation = await ToiletLocationsModel.findById(args.id);
        if (!toiletLocation) {
          throw new Error("invalid toilet location ID");
        }
        // Check if the user is authorized to delete
        isAuthorized(context);

        // Delete the location from the database
        await ToiletLocationsModel.deleteOne({ _id: args.id });

        return toiletLocation;
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: "DELETE_TOILET_LOCATION_ERROR",
          },
        });
      }
    },
  },
};
module.exports = toiletLocationResolver;
