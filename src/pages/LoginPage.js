import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { login, googleLogin, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await signup(email, password);
        setError('회원가입이 완료되었습니다. 로그인해 주세요.');
        setIsRegistering(false);
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      setError(isRegistering ? '회원가입에 실패했습니다.' : '로그인에 실패했습니다.');
      console.error(error);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      await googleLogin();
      navigate('/');
    } catch {
      setError('구글 로그인에 실패했습니다.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {isRegistering ? '회원가입' : '로그인'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-white mb-4 text-white"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-white mb-6 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded hover:bg-blue-100 transition duration-300 mb-4"
          >
            {isRegistering ? '회원가입' : '이메일로 로그인'}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full bg-transparent text-white font-bold py-2 px-4 rounded hover:bg-white/10 transition duration-300 mb-4"
        >
          {isRegistering ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;