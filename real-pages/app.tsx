import type { AppContext, AppProps } from 'next/app'
import App from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const [appProps] = await Promise.all([
    App.getInitialProps(appContext),
  ]);

  const props = { ...appProps };

  if (typeof window === "undefined") {
    if (appContext.ctx.res) {
      appContext.ctx.res.setHeader(
        "Cache-Control",
        "s-maxage=1, stale-while-revalidate"
      );
    }
  }

  return props;
};

export default MyApp
