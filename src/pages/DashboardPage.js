import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import TutorialPopup from '../components/TutorialPopup';
import LoadingScreen from '../components/LoadingScreen';

function Dashboard() {
  const [formData, setFormData] = useState({
    comment: '',
    vehicleNumber: '',
    nickname: '',
    visitPlace: '',
    phoneNumber: '',
    memo: '',
    kakaoOpenChatUrl: '',
  });
  const [fieldVisibility, setFieldVisibility] = useState({
    comment: true,
    vehicleNumber: true,
    nickname: true,
    visitPlace: true,
    phoneNumber: true,
    memo: true,
    kakaoOpenChatUrl: true,
  });
  const [isNewUser, setIsNewUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const fieldLabels = {
    comment: '한줄 코멘트',
    vehicleNumber: '차량 번호',
    nickname: '닉네임',
    visitPlace: '방문지',
    phoneNumber: '전화번호',
    memo: '메모',
    kakaoOpenChatUrl: '카카오 오픈채팅 URL'
  };

  const fetchData = useCallback(async () => {
    if (currentUser) {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'parkingInfo', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Fetched data:", docSnap.data());
          const data = docSnap.data();
          setFormData({
            comment: data.comment || '',
            vehicleNumber: data.vehicleNumber || '',
            nickname: data.nickname || '',
            visitPlace: data.visitPlace || '',
            phoneNumber: data.phoneNumber || '',
            memo: data.memo || '',
            kakaoOpenChatUrl: data.kakaoOpenChatUrl || '',
          });
          setFieldVisibility(data.visibilitySettings || {
            comment: true, vehicleNumber: true, nickname: true, visitPlace: true, phoneNumber: true, memo: true, kakaoOpenChatUrl: true
          });
          setIsNewUser(false);
          setIsEditing(false);
        } else {
          console.log("No existing data found for user.");
          setIsNewUser(true);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVisibilityToggle = (fieldName) => {
    setFieldVisibility(prevState => ({
      ...prevState,
      [fieldName]: !prevState[fieldName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const docRef = doc(db, 'parkingInfo', currentUser.uid);
      const updatedData = {
        ...formData,
        visibilitySettings: fieldVisibility,
        lastUpdated: new Date().toISOString()
      };
      await setDoc(docRef, updatedData);
      console.log("Data saved successfully");
      setIsNewUser(false);
      setIsEditing(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isNewUser) {
      setFormData({
        comment: '',
        vehicleNumber: '',
        nickname: '',
        visitPlace: '',
        phoneNumber: '',
        memo: '',
        kakaoOpenChatUrl: '',
      });
      setFieldVisibility({
        comment: true,
        vehicleNumber: true,
        nickname: true,
        visitPlace: true,
        phoneNumber: true,
        memo: true,
        kakaoOpenChatUrl: true,
      });
    } else {
      fetchData();
    }
    setIsEditing(false);
  };

  const handleGenerateQR = () => {
    navigate(`/qr/${currentUser.uid}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <TutorialPopup />
      <h1 className="text-4xl font-bold mb-6 text-center text-white">SMART PARKING</h1>
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(fieldLabels).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">{fieldLabels[key]}</label>
              <div className="flex items-center space-x-2">
                <input
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  className="flex-grow p-3 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-white text-lg text-white"
                  disabled={!isEditing}
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleVisibilityToggle(key)}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${fieldVisibility[key] ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} text-white`}
                  >
                    {fieldVisibility[key] ? '공개' : '비공개'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isEditing ? (
            <>
              <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded hover:bg-green-600 transition duration-300 text-lg">
                저장
              </button>
              <button type="button" onClick={handleCancel} className="w-full mt-2 bg-gray-500 text-white font-bold py-3 px-4 rounded hover:bg-gray-600 transition duration-300 text-lg">
                취소
              </button>
            </>
          ) : (
            <button type="button" onClick={handleEdit} className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded hover:bg-yellow-600 transition duration-300 text-lg">
              수정
            </button>
          )}
        </form>
        <button onClick={handleGenerateQR} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-600 transition duration-300 text-lg">
          QR 코드 생성
        </button>
        <button onClick={handleLogout} className="w-full mt-4 bg-red-500 text-white font-bold py-3 px-4 rounded hover:bg-red-600 transition duration-300 text-lg">
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default Dashboard;