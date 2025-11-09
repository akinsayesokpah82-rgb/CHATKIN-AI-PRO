import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig.js';

initializeApp(firebaseConfig);

export default function Login({ onLogin }){
  const [loading, setLoading] = useState(false);
  const handleGoogle = async ()=>{
    setLoading(true);
    try{
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      onLogin(res.user);
    }catch(err){
      console.error(err);
      alert('Google sign-in failed: ' + err.message);
    }finally{ setLoading(false); }
  };
  return (
    <div className="login">
      <h1>Welcome to ChatKin AI</h1>
      <button onClick={handleGoogle} disabled={loading}>{loading? 'Signing in...':'Sign in with Google'}</button>
    </div>
  );
}
