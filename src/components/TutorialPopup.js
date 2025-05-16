import React, { useState, useEffect } from 'react';

function TutorialPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    if (dontShowAgain) {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  if (!showPopup) return null;

  console.log("Rendering tutorial popup"); // 디버깅용 로그

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Smart Parking Memo 사용 가이드</h2>
        <ul className="list-disc pl-5 mb-4 text-black">
          <li className="mb-2">차량정보를 입력하고 저장버튼을 클릭하세요.</li>
          <li className="mb-2">카카오 오픈채팅URL은 카카오톡의 하단부 오픈채팅탭에서 상단의 새로운 오픈채팅아이콘을 클릭한 후 링크를 복사하여 붙여넣기 하면됩니다.</li>
          <li className="mb-2">QR코드생성 버튼을 누르면 QR코드가 들어간 이미지가 갤러리에 저장됩니다.</li>
          <li className="mb-2">저장된 이미지를 다운받아 원하는 크기로 출력하여 차량에 부착하세요.</li>
          <li className="mb-2">다른 사용자가 QR코드를 스캔하면 차량 정보를 확인할 수 있습니다.</li>
          <li className="mb-2">상황에 맞게 정보를 수정하여 사용하시면 됩니다.</li>
        </ul>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="dontShowAgain" className="text-black">다시 보지 않기</label>
        </div>
        <button
          onClick={handleClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default TutorialPopup;