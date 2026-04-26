import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Allow only Northwestern emails logic:
      if (currentUser && !currentUser.email.endsWith('@northwestern.edu') && !currentUser.email.endsWith('@u.northwestern.edu')) {
        signOut(auth);
        alert('Please log in with a valid Northwestern email address (@northwestern.edu or @u.northwestern.edu).');
        setUser(null);
      } else {
        setUser(currentUser);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    googleProvider.setCustomParameters({
      hd: 'u.northwestern.edu'
    });
    return signInWithPopup(auth, googleProvider);
  };

  const sendLoginLink = (email) => {
    const actionCodeSettings = {
      // Redirects user back to login so we can process the link
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    };
    return sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const loginWithEmailLink = (email, windowUrl) => {
    return signInWithEmailLink(auth, email, windowUrl);
  };

  const isEmailLink = (windowUrl) => {
    return isSignInWithEmailLink(auth, windowUrl);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      sendLoginLink, 
      loginWithEmailLink, 
      isEmailLink,
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
