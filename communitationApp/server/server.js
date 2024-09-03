const express = require('express');
const multer = require('multer');
const path = require('path');
const { createConnection } = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { compare, hash } = require('bcrypt');
const fs = require('fs');

const app = express();
const port = 3309;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  }),
});

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'userdatabase',
  port: 3307
});

db.connect(err => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 연결됨');
});

app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류:', err);
      return res.status(500).send('서버 내부 오류.');
    }
    res.json(results);
  });
});

app.get('/allPosts/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT * FROM posts WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류:', err);
      return res.status(500).send('서버 오류.');
    }
    res.json(results);
  });
});




app.put('/profile', (req, res) => {
  const { email, username, profileImage } = req.body;

  const query = 'UPDATE userdata SET name = ?, profileImage = ? WHERE email = ?';
  db.query(query, [username, profileImage, email], (err, results) => {
    if (err) {
      console.error('프로필 업데이트 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.status(200).send('프로필 업데이트 성공');
  });
});


// 프로필 정보 가져오기
app.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT name, profileImage FROM userdata WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류:', err);
      return res.status(500).send('서버 오류.');
    }
    if (results.length === 0) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }
    res.json(results[0]);
  });
});

// 프로필 정보 업데이트
app.post('/profile/update', (req, res) => {
  const { email, name, profileImage } = req.body;

  if (!email || !name || !profileImage) {
    return res.status(400).send('이메일, 이름, 프로필 이미지 URI는 필수입니다.');
  }

  const query = 'UPDATE userdata SET name = ?, profileImage = ? WHERE email = ?';

  db.query(query, [name, profileImage, email], (err) => {
    if (err) {
      console.error('데이터베이스 업데이트 오류:', err);
      return res.status(500).send('서버 오류.');
    }
    res.status(200).send('프로필 업데이트 성공.');
  });
});



// // 좋아요 처리
// app.post('/posts/like/:postId', (req, res) => {
//   const { userId } = req.body;
//   const { postId } = req.params;

//   const query = 'INSERT INTO likes (email, postId) VALUES (?, ?)';

//   db.query(query, [userId, postId], (err) => {
//     if (err) {
//       console.error('좋아요 처리 오류:', err);
//       return res.status(500).send('서버 내부 오류.');
//     }
//     res.status(200).send('좋아요 처리 성공.');
//   });
// });

// // 좋아요 취소
// app.post('/posts/unlike/:postId', (req, res) => {
//   const { userId } = req.body;
//   const { postId } = req.params;

//   const query = 'DELETE FROM likes WHERE email = ? AND postId = ?';

//   db.query(query, [userId, postId], (err) => {
//     if (err) {
//       console.error('좋아요 취소 오류:', err);
//       return res.status(500).send('서버 내부 오류.');
//     }
//     res.status(200).send('좋아요 취소 성공.');
//   });
// });

// // 좋아요 상태 조회
// app.get('/posts/liked/:userId', (req, res) => {
//   const { userId } = req.params;

//   const query = 'SELECT postId FROM likes WHERE email = ?';

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('좋아요 상태 조회 오류:', err);
//       return res.status(500).json({ error: '서버 내부 오류.' });
//     }

//     const likedPostIds = results.map(row => row.postId);
//     res.json(likedPostIds);
//   });
// });


// 게시물 업로드
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }
  const imageUrl = `http://192.168.0.27:${port}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// 게시물 생성
app.post('/posts/create', (req, res) => {
  const { imageUri,email, title, description } = req.body;

  if (!imageUri || !title || !description) {
    return res.status(400).json({ error: '이미지 URI, 제목, 설명은 필수입니다.' });
  }

  const query = 'INSERT INTO posts (imageUri, email, title, description) VALUES (?, ?, ?, ?)';

  db.query(query, [imageUri,email, title, description], (err, results) => {
    if (err) {
      console.error('데이터베이스 오류:', err);
      return res.status(500).json({ error: '게시물 삽입 실패.' });
    }

    res.status(201).json({ message: '게시물 삽입 성공.', postId: results.insertId });
  });
});


// 사용자 등록
app.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send("이메일, 비밀번호, 이름은 필수입니다.");
  }

  hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('비밀번호 해싱 오류:', err);
      return res.status(500).send('등록 실패.');
    }

    const query = `INSERT INTO userdata (email, passWord, name) VALUES (?, ?, ?)`;

    db.query(query, [email, hashedPassword, name], (err, results) => {
      if (err) {
        console.error('데이터베이스 오류:', err);
        return res.status(500).send('등록 실패.');
      }

      console.log('등록 성공.');
      return res.status(200).json({ message: '등록 성공.' });
    });
  });
});

// 로그인
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("이메일과 비밀번호는 필수입니다.");
  }

  const query = `SELECT passWord FROM userdata WHERE email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류:', err);
      return res.status(500).send("서버 내부 오류.");
    }

    if (results.length === 0) {
      console.error('사용자를 찾을 수 없음.');
      return res.status(401).send("잘못된 이메일 또는 비밀번호.");
    }

    const hashedPassword = results[0].passWord;

    compare(password, hashedPassword, (bcryptErr, match) => {
      if (bcryptErr) {
        console.error('비밀번호 비교 오류:', bcryptErr);
        return res.status(500).send("서버 내부 오류.");
      }

      if (match) {
        console.log('로그인 성공.');
        return res.status(200).send("로그인 성공.");
      } else {
        console.error('잘못된 비밀번호.');
        return res.status(401).send("잘못된 이메일 또는 비밀번호.");
      }
    });
  });
});



app.get('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const query = 'SELECT * FROM comments WHERE postId = ?';

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).send('Server error.');
    }
    res.json(results);
  });
});

app.post('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { email, comment } = req.body;

  if (!email || !comment) {
    return res.status(400).send('Email and comment are required.');
  }

  const query = 'INSERT INTO comments (postId, email, comment) VALUES (?, ?, ?)';
  db.query(query, [postId, email, comment], (err, results) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).send('Server error.');
    }
    res.status(201).json({ message: 'Comment added.', commentId: results.insertId });
  });
});

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;

  const query = 'DELETE FROM comments WHERE id = ? AND postId = ?';
  db.query(query, [commentId, postId], (err) => {
    if (err) {
      console.error('Error deleting comment:', err);
      return res.status(500).send('Server error.');
    }
    res.status(200).send('Comment deleted.');
  });
});


app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
