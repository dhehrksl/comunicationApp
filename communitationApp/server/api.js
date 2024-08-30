import FormData from 'form-data';

const API_URL = 'http://192.168.0.27:3309';

export const uploadImageToServer = async (uri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(errorResponse);
    }

    const result = await response.json();
    return result.imageUrl;
  } catch (error) {
    console.error('업로드 오류:', error);
    throw error;
  }
};


export const postToDatabase = async (post) => {
  const response = await fetch(`${API_URL}/posts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('게시물 업로드 실패');
  }
};

