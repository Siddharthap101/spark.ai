import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import Documentation from './pages/Documentation';
import Features from './pages/Features';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import TermsOfUse from "./pages/Terms";
import ResetPassword from './pages/ResetPassword';
import Privacyof from "./pages/Privacy";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  { 
    path: '/chat',
    element: <ChatRoom />,
  },
  {
    path: '/documentation',
    element: <Documentation />,
  },
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/about',
    element: <About />,
  },
  
  {
    path: '/Login',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/terms',
    element: <TermsOfUse />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/privacy',
    element: <Privacyof />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;