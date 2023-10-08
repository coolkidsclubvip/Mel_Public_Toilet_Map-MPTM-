// Import React hooks and components
import { useState, useEffect } from "react"; // React Hooks
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // React Router Libraries
import { Container } from "react-bootstrap"; // React Bootstrap Library

// Import custom components
import Header from "./Components/Header";
import Toilets from "./Pages/Toilets";
import Profile from "./Pages/Profile";
// import JournalEntryEdit from "./Pages/JournalEntryEdit";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";

//? APOLLO CLIENT
// Import Apollo Client and related dependencies
// ApolloClient - Used to connect to the GraphQL server 
// InMemoryCache - Used to cache GraphQL data
// ApolloProvider - Used to provide access to the Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

function App() {
  const [user, setUser] = useState(null); // User state

  //Saves user to State and Session Storage
  const handleLogin = (user) => {
    setUser(user); // Set user to state
    saveTokenToSessionStorage(user); // Save user to session storage
  };

  //Clears user from State and Session Storage
  const handleLogout = () => {
    client.clearStore(); // Clear Apollo Client cache
    sessionStorage.removeItem("user"); // Clear session storage
    setUser(null); // Clear user from state
  };

  //Saves user to Session Storage
  function saveTokenToSessionStorage(user) {
    sessionStorage.setItem("user", JSON.stringify(user)); // Save user to session storage as a string
  }

  //Gets user from Session Storage
  const getUserFromSessionStorage = () => {
    try {
      const userString = sessionStorage.getItem("user"); // Get user from session storage
      const user = JSON.parse(userString); // Parse user to JSON
      return user;
    } catch (error) {
      sessionStorage.setItem("user", ""); // Clear session storage
      return null;
    }
  };

  //Protected Route
  // If user is not logged in, redirect to login page
  // Component - Component to render
  // ...rest - Other props
  function ProtectedRoute({ component: Component, ...rest }) {
    const user = getUserFromSessionStorage(); // Get user from session storage
    // If user is not logged in, redirect to login page
    if (!user) {
      return <Navigate to="/login" replace />; // Redirect to login page
    }
    return <Component {...rest} user={user} />; // Render protected component
  }

  //Check if user is logged in on page load
  useEffect(() => {
    const user = getUserFromSessionStorage();
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Apollo Provider wraps the entire app to provide access to the Apollo Client */}{" "}
      {/* 这是Apollo Client库提供的顶级组件，用于将GraphQL客户端与React应用程序集成在一起，以便在组件中使用GraphQL查询和数据。 */}
      <ApolloProvider client={client}>
        <Container className="min-width">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
            {/* Protected Routes */}{" "}
            {/*This is a routing configuration for the main page. When the root path "/" is specified, the ProtectedRoute component should be rendered, and the Toilet component is passed as the component attribute and the current user user */}
            <Route
              path="/"
              element={<ProtectedRoute component={Toilets} user={user} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute component={Profile} user={user} />}
            />
            {/* Protected Journal Entry Edit Route */}
            {/* <Route
              path="/journal/edit/:journalEntryId"
              element={
                <ProtectedRoute component={JournalEntryEdit} user={user} />
              }
            /> */}
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
