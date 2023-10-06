// Import React hooks and components
import { useState, useEffect } from "react"; // React Hooks
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // React Router Libraries
import { Container } from "react-bootstrap"; // React Bootstrap Library

// Import custom components
import Header from "./Components/Header";
import Journal from "./Pages/Journal";
import JournalEntryEdit from "./Pages/JournalEntryEdit";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import NotFound from "./Pages/NotFound";

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

  // 当用户尝试访问某些需要授权才能访问的页面时，我们需要一种方式来确保用户已经登录。ProtectedRoute 组件就是为了实现这一目的而创建的。
  // 这个组件接受一个对象作为参数，这个对象的结构是 { component: Component, ...rest }，这里采用了解构赋值语法。
  // { component: Component }：这部分是解构赋值的一部分，它从传递给组件的参数中提取 component 属性，并将其重命名为 Component。这个属性实际上是一个要渲染的页面组件，例如，在应用中的 Journal 组件。...rest：这是另一个解构赋值的部分，它收集了传递给组件的其他所有属性。这样，无论其他属性是什么，它们都可以传递给 Component 组件。
  // 接下来，ProtectedRoute 组件执行以下操作：
  // 它尝试从会话存储中获取用户信息，以确定用户是否已登录。这是通过调用 getUserFromSessionStorage 函数来实现的。
  // 如果用户已登录（user 存在），则将 Component 组件渲染，并将 user 作为 user 属性传递给它。这意味着用户可以访问该受保护的路由。
  // 如果用户未登录（user 不存在），则会使用 Navigate 组件从当前路径重定向到登录页面。这是通过返回 <Navigate to="/login" replace/> 来实现的，这会将用户导航到登录页面。
  // 总之，ProtectedRoute 组件用于保护需要用户登录才能访问的页面。如果用户已登录，它允许用户访问页面；如果用户未登录，它会将用户重定向到登录页面。这是一种非常常见的前端路由保护机制，用于确保用户只能访问他们有权限访问的页面。
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
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
            {/* Protected Journal Routes */}{" "}
            {/* 这是一个主页面的路由配置，指定了根路径"/"时应该渲染ProtectedRoute组件，并传递了Journal组件作为component属性以及当前用户user */}
            <Route
              path="/"
              element={<ProtectedRoute component={Journal} user={user} />}
            />
            {/* Protected Journal Entry Edit Route */}
            <Route
              path="/journal/edit/:journalEntryId"
              element={
                <ProtectedRoute component={JournalEntryEdit} user={user} />
              }
            />
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
