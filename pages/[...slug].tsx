import dynamic from 'next/dynamic';
const page = import('../real-pages/[...slug]')

const Page = dynamic(() => import('../real-pages/[...slug]'));
// @ts-ignore
Page.getInitialProps = async (ctx: any) => {
  const getInitialProps = (await page).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Page