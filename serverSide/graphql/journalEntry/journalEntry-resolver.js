// Import necessary modules and models
const { JournalEntry, validateJournalEntry } = require('../../models/journalEntry');
const { GraphQLError } = require('graphql');
const { isAuthenticated, isAuthorized } = require('../../helpers/auth')

// Define the journalEntryResolver object, which contains resolvers for the JournalEntryType, Query, and Mutation types
const journalEntryResolver = {
  // Resolver for the "user" field of the "JournalEntryType"x type
  // This resolver is used to load related data for journal entries
  // JournalEntryRelated: {
  //   user: async (parent, args) => {
  //     try {
  //       // Find the user that matches the user ID of the current journal entry
  //       return await UserModel.findById(parent.user);
  //     } catch (error) {
  //       // If there was an error, throw an ApolloError with a custom error code
  //       throw new GraphQLError(error, {
  //         extensions: {
  //           code: 'GET_USER_ERROR'
  //         },
  //       });
  //     }
  //   },
  // },
  // Resolvers for the "journalEntry", "journalEntries", and "searchJournalEntries" queries
  Query: {
    journalEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the journal entry to delete by its ID
        let journalEntry = await JournalEntry.findById(args.id);
        if (!journalEntry) {
          // If the journal entry doesn't exist, throw an Error
          throw new Error('Journal entry not found')
        }
        // Check if the user is authorized to delete the journal entry
        isAuthorized(journalEntry, context);

        return journalEntry
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_JOURNAL_ENTRY_ERROR',
          },
        });
      }
    },
    journalEntries: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find all journal entries
        return await JournalEntry.find({ user: context.user._id });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_JOURNAL_ENTRIES_ERROR'
          },
        });
      }
    },
    searchJournalEntries: async (parent, args) => {
      try {
        // Find all journal entries that match the title provided in the query arguments
        return await JournalEntry.find({ title: new RegExp('^' + args.title + '$', "i") });
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'SEARCH_JOURNAL_ENTRIES_ERROR'
          },
        });
      }
    },
  },
  // Resolvers for the "addJournalEntry", "editJournalEntry", and "deleteJournalEntry" mutations
  Mutation: {
    createJournalEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Validate the input data using the validateJournalEntry function
        const { error } = validateJournalEntry(args.input);
        if (error) {
          // If the input data is invalid, throw an Error
          throw new Error('Invalid input data')
        }
        // Create a new journal entry using the input data
        const journalEntry = new JournalEntry({
          title: args.input.title,
          body: args.input.body,
          mood: args.input.mood,
          user: context.user._id,
        });
        // Save the new journal entry to the database
        await journalEntry.save();
        // Return the new journal entry
        return journalEntry;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'CREATE_JOURNAL_ENTRY_ERROR'
          },
        });
      }
    },
    updateJournalEntry: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
        // Find the journal entry to update by its ID
        let journalEntry = await JournalEntry.findById(args.id);
        if (!journalEntry) {
          // If the journal entry doesn't exist, throw an Error
          throw new Error('Journal entry not found')
        }
        // Check if the user is authorized to edit the journal entry
        isAuthorized(journalEntry, context);
        // Update the journal entry with the input data
        journalEntry.title = args.input.title;
        journalEntry.body = args.input.body;
        journalEntry.mood = args.input.mood;
        // Save the updated journal entry to the database
        return await journalEntry.save();
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'UPDATE_JOURNAL_ENTRY_ERROR'
          },
        });
      }
    },
    deleteJournalEntry: async (parent, args, context) => {
      try {

        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the journal entry to delete by its ID
        let journalEntry = await JournalEntry.findById(args.id);
        if (!journalEntry) {
          // If the journal entry doesn't exist, throw an Error
          throw new Error('Journal entry not found')
        }
        // Check if the user is authorized to delete the journal entry
        isAuthorized(journalEntry, context);
        // Delete the journal entry from the database
        await JournalEntry.deleteOne({ _id: args.id });
        // Return a success message and the deleted journal entry
        journalEntry.id = args.id
        return journalEntry
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'DELETE_JOURNAL_ENTRY_ERROR'
          },
        });
      }
    },
  },
};

// Export the journalEntryResolver object
module.exports = journalEntryResolver;