import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid || isNaN(uid)) {
    return res.status(400).json({ error: 'UID ไม่ถูกต้อง' });
  }

  try {
    const response = await fetch(`https://enka.network/api/hsr/${uid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (HSRProxy)'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'ไม่สามารถดึงข้อมูลจาก Enka ได้' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด: ' + err.message });
  }
}
