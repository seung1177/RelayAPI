const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan'); // 요청 로깅 라이브러리
const app = express();

const PORT = 3000;
const API_URL = 'http://localhost:3001'; // 환경 변수 지원

const corsOptions = {
  origin: ['http://localhost:3000'], // 허용할 도메인 지정
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined'));

// 공통 요청 핸들러 (모든 요청 처리)
const handleRequest = async (req, res, next) => {
  try {
    console.log(`[${req.method}] 요청: ${req.originalUrl}`);

    // 요청 전송
    const response = await axios({
      url: `${API_URL}${req.path}`,
      method: req.method,
      data: req.body || {},
      headers: req.headers || {},
    });

    // 응답 전달
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`에러 발생: ${error.message}`);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
};

app.use('*', handleRequest);

app.use((err, req, res, next) => {
  console.error(`🔥 서버 에러: ${err.message}`);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
