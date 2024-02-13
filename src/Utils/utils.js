function generateUniqueRoomId() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Random string of length 6
  
    return `${timestamp}-${randomString}`;
  }


module.exports = generateUniqueRoomId