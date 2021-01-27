// apply global CSS
// https://www.tutorialspoint.com/nextjs/nextjs_global_css_support.htm
import "../sass/bulmastyles.scss";

import buildClient from "../api/buildClient";
import Header from "../components/Header";

// https://nextjs.org/docs/advanced-features/custom-app
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const axiosClient = buildClient(appContext.ctx);
  const { data } = await axiosClient.get("/api/users/currentuser");

  // invoke all getInitialProps for its children
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axiosClient,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
