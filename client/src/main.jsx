import { createRoot } from "react-dom/client"   /* Used to render and initialize a react projet on browser */
import "./index.css"
import App from "./App.jsx"
import {BrowserRouter} from "react-router-dom"    /* Standard Routing Package for react -> Used to manage navigation, pages, URLs */
import { GoogleOAuthProvider } from '@react-oauth/google';  /* Used to render the application under the context of the Google OAuth provider */
import { AuthProvider } from "./context/Auth.jsx"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)