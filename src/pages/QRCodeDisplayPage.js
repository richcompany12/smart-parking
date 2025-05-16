import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function QRCodeDisplay() {
  const { id } = useParams();
  const [qrData, setQRData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'parkingInfo', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQRData(`https://smart-parking-c78a4.web.app/info/${id}`);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error fetching QR data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // QR 코드 그리기
      const qrCanvas = document.getElementById('qr-code');
      const qrSize = Math.min(canvas.width, canvas.height) * 0.65; // QR 코드 크기를 65%로 확대
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = (canvas.height - qrSize) / 2 - canvas.height * 0.065; // 위로 6.5% 이동
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // 이미지 다운로드
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'smart-parking-qr.png';
      link.href = dataURL;
      link.click();
    };
    img.src = '/default-image.png'; // public 폴더의 기본 이미지 사용
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">카메라로 QR코드를 스캔하여 차량 정보를 확인하세요!</h2>
        {qrData && (
          <>
            <div className="bg-white p-4 rounded-lg inline-block mb-6">
              <QRCode id="qr-code" value={qrData} size={256} />
            </div>
            <button
              onClick={handleSaveImage}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 mb-2 w-full"
            >
              이미지 저장하기
            </button>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default QRCodeDisplay;