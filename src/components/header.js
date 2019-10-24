import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import {styled} from "linaria/react";

const HeaderContainer = styled.header`
background: rebeccapurple;
`;

const Header = ({ siteTitle }) => (
  <HeaderContainer>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </HeaderContainer>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
