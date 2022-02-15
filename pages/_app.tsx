import dynamic from "next/dynamic";
const page = import("../real-pages/app");

const App = dynamic(() => import("../real-pages/app"));
// @ts-ignore
App.getInitialProps = async (ctx: any) => {
  const getInitialProps = (await page).default?.getInitialProps;

  if (getInitialProps) {
    return getInitialProps(ctx);
  }
  return {};
};

export default App;
