import dynamic from 'next/dynamic';
const PageImport = import('../../real-pages/login')
const Page = dynamic(() => PageImport)
const Wrapper = (props: any) => {
  return <Page {...props}></Page>
}
Wrapper.getInitialProps = async (ctx: any) => {
  const gip = (await PageImport).default
  {/* @ts-ignore */ }
  return gip.getInitialProps(ctx)
}

export default Wrapper