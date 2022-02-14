import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../real-pages/home'));

// @ts-ignore
Home.getInitialProps = async (ctx: any) => {
  const homeImport = import('../real-pages/home')

  const getInitialProps = (await homeImport).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Home