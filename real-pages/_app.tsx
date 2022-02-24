import type { AppContext, AppProps } from 'next/app'
import App from 'next/app';
import React, { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import remotes from '../remotes';

import type { NavItem } from "../data/nav";

// const Nav = dynamic(() => import('ui/Nav'))
import OldNav from 'ui/OldNav'

type MyAppProps = AppProps & {
  navItems: NavItem[]
}

const MyApp = ({ Component, pageProps, navItems }: MyAppProps) => {
  const [nav, setNav] = useState<NavItem[] | undefined>()
  const customTheme = theme;
  useEffect(() => {
    setNav(navItems)
  }, [])

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <OldNav navItems={nav} />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const [appProps, navItems] = await Promise.all([
    App.getInitialProps(appContext),
    typeof window !== "undefined"
      // @ts-ignore
      ? __NEXT_DATA__.props.navData
      : fetch(`${remotes.home.apiPath}/nav`).then((res) => {
        return res.json()
      }),
  ]);

  const props = { ...appProps, navItems };

  if (typeof window === "undefined") {
    appContext?.ctx?.res?.setHeader(
      "Cache-Control",
      "s-maxage=1, stale-while-revalidate"
    );
  }

  return props;
};

export default MyApp;
