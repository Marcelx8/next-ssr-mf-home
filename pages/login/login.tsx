import dynamic from 'next/dynamic';

const Login = dynamic(() => import('../../real-pages/login'));

// @ts-ignore
Login.getInitialProps = async (ctx: any) => {
  const loginImport = import('../../real-pages/login')

  const getInitialProps = (await loginImport).default?.getInitialProps;
  if (getInitialProps) {
    return getInitialProps(ctx)
  }
  return {}
}

export default Login