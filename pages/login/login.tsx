import dynamic from 'next/dynamic';
const page = import('../../real-pages/login/login')

const Login = dynamic(() => import('../../real-pages/login/login'));
// @ts-ignore
Login.getInitialProps = async (ctx: any) => {

  const getInitialProps = (await page).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Login