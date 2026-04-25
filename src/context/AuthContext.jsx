import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Uncomment the below lines if you ONLY want to allow Northwestern emails
      /*
      if (currentUser && !currentUser.email.endsWith('@u.northwestern.edu')) {
        signOut(auth);
        alert('Please log in with a @u.northwestern.edu email address.');
        setUser(null);
      } else {
      */
        setUser(currentUser);
      /* } */
      
      setLoading(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const loginWithGoogle = () => {
    // This hints the Google login to default to Northwestern emails!
    googleProvider.setCustomParameters({
      hd: 'u.northwestern.edu'
    });
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
