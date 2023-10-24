// Import React hooks and components
import { useState, useEffect } from "react"; // React Hooks
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // React Router Libraries
import { Container } from "react-bootstrap"; // React Bootstrap Library

// Import custom components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ToiletLocations from "./Pages/ToiletLocations";
import Profile from "./Pages/Profile";
import ToiletEntry from "./Components/ToiletEntry";
import ToiletEdit from "./Components/ToiletEdit";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";
import SearchResult from "./Pages/SearchResult";

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
  const [searchText, setSearchText] = useState(""); // Search text state

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
      {/* This is a top-level component provided by the Apollo Client library for integrating GraphQL clients with React applications to use GraphQL queries and data in components. */}
      <ApolloProvider client={client}>
        <Container fluid className=" min-width p-0">
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

          <Header
            user={user}
            onLogout={handleLogout}
            setSearchText={setSearchText}
          />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
            {/* Protected Routes */}{" "}
            {/*This is a routing configuration for the main page. When the root path "/" is specified, the ProtectedRoute component should be rendered, and the Toilet component is passed as the component attribute and the current user user */}
            <Route
              path="/"
              element={
                <ProtectedRoute component={ToiletLocations} user={user} />
              }
            />
            <Route
              path="/profile"
              element={<ProtectedRoute component={Profile} user={user} />}
            />
            <Route
              path="/addLocation"
              element={<ProtectedRoute component={ToiletEntry} user={user} />}
            />
            {/* Protected location entry edit route */}
            <Route
              path="/toiletLocations/edit/:toiletLocationId"
              element={<ProtectedRoute component={ToiletEdit} user={user} />}
            />
            {/* Protected search result route */}
            <Route
              path="/searchresult"
              element={
                <ProtectedRoute
                  component={SearchResult}
                  searchText={searchText}
                  user={user}
                />
              }
            />
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
