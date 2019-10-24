/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import {styled} from "linaria/react";

import Header from "./header";
import "./layout.css";

const FullHeightLayout = styled.div`
display: flex;
flex-flow: column nowrap;
min-height: 100%;
min-height: 100vh;
>main {
  flex: 1;
}
`;

const MainContentContainer = styled.main`
flex: 1;
padding: 1em 2em;
`;

const Footer = styled.footer`
font-size: 0.8em;
padding: 0.1em;
text-align: center;
font-family: sans-serif;

color: #FFF;
background-color: rebeccapurple;
a {
  color: #BBE;
  &:visited {
    color: #EBE;
  }
}
`;

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

    return (
        <FullHeightLayout>
          <Header siteTitle={data.site.siteMetadata.title} />
          <MainContentContainer>
            {children}
          </MainContentContainer>
          <Footer>
            © {new Date().getFullYear()}, Built by RMP with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </Footer>
        </FullHeightLayout>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
