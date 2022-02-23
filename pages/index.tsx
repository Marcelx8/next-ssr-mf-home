import dynamic from 'next/dynamic';
const page = import('../real-pages/index')

const Index = dynamic(() => import('../real-pages/index'))
// @ts-ignore
Index.getInitialProps = async (ctx: any) => {
  const getInitialProps = (await page).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Index