import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {useAuth} from '../contexts/AuthContext';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  query,
  getDocs,
  where,
} from 'firebase/firestore';

function UserLogin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const  {login} = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailCheck, setEmailCheck] = useState('');
  const [userNavigate, setUserNavigate] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const email = emailRef.current.value; 
       const seekerSnapshot = collection(db, 'Users');
        const seekerEmailQuery = query(
          seekerSnapshot,
          where('email', '==', email)
        );
        const seekerQuerySnapshot = await getDocs(seekerEmailQuery);
        if (!seekerQuerySnapshot.empty) {
          setUserNavigate('/userpage');
          setLoading(false);
        } else {
          setLoading(false);
          setError('Email Not Found');
        }
      
    } catch (error) {
      console.error('Error signing in: ', error);
      setError('Unable to Login');
      setLoading(false);
    }
  }

  //purpose is to check if userNavigate is storing a value and if it does we call the login function and navigate to the appropriate page
  useEffect(() => {
    if (userNavigate) {
      const loginFunction = async () => {
        try {
          const userCredentials = await login(
            emailRef.current.value,
            passwordRef.current.value
          );
          navigate(userNavigate, {
            state: { name: userCredentials.user.uid }
          });
        } catch (error) {
          console.error('Error signing in: ', error);
          setError('Unable to Login');
          setLoading(false);
        }
      };

      loginFunction();
    }
  }, [userNavigate, navigate, login]);

  const handleEmailCheck = (e) => {
    e.preventDefault();
    setEmailCheck(e.target.value);
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-10 pt-0">
        <h2 className="text-center text-2xl font-bold mb-4">Log In</h2>
        {error && <p className="bg-red-500 text-white p-3 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              ref={emailRef}
              value={emailCheck}
              onChange={handleEmailCheck}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/SeekerForgotPassword"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
}

export default UserLogin;
