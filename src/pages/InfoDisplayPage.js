import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function InfoDisplay() {
  const { id } = useParams();
  const [parkingInfo, setParkingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParkingInfo = async () => {
      if (!id) {
        setError("유효하지 않은 QR 코드입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const docRef = doc(db, 'parkingInfo', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setParkingInfo(docSnap.data());
        } else {
          console.log("No such document!");
          setError("주차 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error('Error fetching parking info:', error);
        setError("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingInfo();
  }, [id]);

  const handleKakaoChat = () => {
    if (parkingInfo.kakaoOpenChatUrl) {
      window.open(parkingInfo.kakaoOpenChatUrl, '_blank');
    }
  };

  const handlePhoneCall = () => {
    if (parkingInfo.phoneNumber) {
      window.location.href = `tel:${parkingInfo.phoneNumber}`;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-white text-2xl">로딩 중...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-white text-2xl">{error}</div>
    </div>;
  }

  if (!parkingInfo) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-white text-2xl">주차 정보를 찾을 수 없습니다.</div>
    </div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src="/smart-parking-logo.png" alt="Smart Parking Logo" className="w-24 h-24 mr-3" />
          <h1 className="text-3xl font-bold text-white">Smart Parking Memo</h1>
        </div>
        <p className="text-2xl font-bold mb-6 text-white text-center">
          최근 갱신: {parkingInfo.lastUpdated ? formatDate(parkingInfo.lastUpdated) : '정보 없음'}
        </p>
        <div className="space-y-3 text-xl text-white">
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.vehicleNumber) && parkingInfo.vehicleNumber && (
            <p>차량 번호: {parkingInfo.vehicleNumber}</p>
          )}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.nickname) && parkingInfo.nickname && (
            <p>닉네임: {parkingInfo.nickname}</p>
          )}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.visitPlace) && parkingInfo.visitPlace && (
            <p>방문지: {parkingInfo.visitPlace}</p>
          )}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.phoneNumber) && parkingInfo.phoneNumber && (
            <p>전화번호: {parkingInfo.phoneNumber}</p>
          )}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.memo) && parkingInfo.memo && (
            <p>메모: {parkingInfo.memo}</p>
          )}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.comment) && parkingInfo.comment && (
            <p>코멘트: {parkingInfo.comment}</p>
          )}
        </div>
        <div className="mt-6 space-y-4">
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.kakaoOpenChatUrl) && parkingInfo.kakaoOpenChatUrl && (
            <button
              onClick={handleKakaoChat}
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition duration-300"
            >
              카카오톡으로 대화하기
            </button>
          )}
          {/* 전화걸기 버튼은 전화번호 공개 여부에 따라 항상 표시되거나, 전화번호 필드의 공개 여부를 따를 수 있습니다.
              여기서는 전화번호 필드가 공개일 때만 전화걸기 버튼이 보이도록 합니다. */}
          {(!parkingInfo.visibilitySettings || parkingInfo.visibilitySettings.phoneNumber) && parkingInfo.phoneNumber && (
            <button
              onClick={handlePhoneCall}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            >
              차주에게 전화걸기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoDisplay;