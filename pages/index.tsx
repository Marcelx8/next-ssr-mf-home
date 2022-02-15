import dynamic from 'next/dynamic';

const Index = dynamic(() => import('../real-pages/index'));

// @ts-ignore
Index.getInitialProps = async (ctx: any) => {
  const indexImport = import('../real-pages/index')

  const getInitialProps = (await indexImport).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Index