import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import useGlobalContext from "~/view-data/use-global-context";
import DefaultLayout from "~/views/_layouts/default";
import PortalLayout from "~/views/_layouts/portal";

const getLayout = (auth, rest) => {
  const { menu = [], signed = false } = auth,
    { path = "" } = rest,
    menuItem = _.find(
      menu,
      r => r.path === path || path.startsWith(`${r.path}/`)
    ),
    isOk = ["/home", "/forbidden"].includes(path) || menuItem,
    layout = !!signed ? DefaultLayout : PortalLayout,
    redirectToHome = signed && ["/"].includes(path);

  return {
    signed: !!signed,
    isOk: !!isOk,
    layout,
    redirectToHome,
    acls: _.get(menuItem, "perms") || []
  };
};

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const {
    state: { auth = {} }
  } = useGlobalContext();
  const { signed, redirectToHome, isOk, layout: Layout, acls } = getLayout(
    auth,
    rest
  );

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }
  if (redirectToHome) {
    return <Redirect to="/home" />;
  }
  if (signed && !isOk) {
    return <Redirect to="/forbidden" />;
  }

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} acls={acls} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};

RouteWrapper.defaultProps = {
  isPrivate: false
};
