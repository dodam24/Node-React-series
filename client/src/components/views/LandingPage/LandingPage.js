import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

  // 요청을 서버로 보낸다.
  useEffect(() => {
    axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, [])

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage
