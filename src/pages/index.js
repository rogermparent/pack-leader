import React from "react";

import Layout from "../components/layout";
import PackageCalculator from "../components/PackageCalculator";
import TitleChanger from "../components/TitleChanger";

const IndexPage = () => {
    return(
        <Layout>
          <TitleChanger initialTitle="Package Calculator"/>
          <PackageCalculator />
        </Layout>
    );
};

export default IndexPage;
