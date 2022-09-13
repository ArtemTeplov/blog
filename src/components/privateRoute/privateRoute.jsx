import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, loggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        return loggedIn ? children : <Redirect to="/sign-in" />;
      }}
    />
  );
};

export default PrivateRoute;