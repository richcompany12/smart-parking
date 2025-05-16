const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// 주차 정보 저장
app.post('/parking-info', async (req, res) => {
  try {
    const { comment, vehicleNumber, nickname, visitPlace, phoneNumber, memo, kakaoOpenChatUrl } = req.body;
    const docRef = await db.collection('parking-info').add({
      comment,
      vehicleNumber,
      nickname,
      visitPlace,
      phoneNumber,
      memo,
      kakaoOpenChatUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 주차 정보 조회
app.get('/parking-info/:id', async (req, res) => {
  try {
    const doc = await db.collection('parking-info').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Parking info not found' });
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 주차 정보 업데이트
app.put('/parking-info/:id', async (req, res) => {
  try {
    const { comment, memo } = req.body;
    await db.collection('parking-info').doc(req.params.id).update({
      comment,
      memo,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

exports.api = functions.https.onRequest(app);