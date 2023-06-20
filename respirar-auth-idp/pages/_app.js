import { SessionProvider } from '../components/session-provider';
import { Login } from '../pages/login'

export default function MyApp({ 
    Component, 
    pageProps: {session, ...pageProps} }) {
   
    return (
        <SessionProvider>
            <Component {...pageProps} />
        </SessionProvider>
    )
  }
