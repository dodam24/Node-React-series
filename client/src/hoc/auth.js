import React, { useEffect } from 'react';
import Axios from 'axios';
import { auth } from '../_actions/user_action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function withAuthenticationCheck(SpecificComponent, option, adminRoute = null) {

  // option의 3가지 옵션
    // 1. null : 아무나 접근 가능한 페이지
    // 2. true : 로그인한 유저만 접근 가능한 페이지
    // 3. false : 로그인한 유저는 접근 불가능한 페이지
  
  function AuthenticationCheck(props) {
    let navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {

      dispatch(auth()).then(response => {
        console.log(response)

        // 로그인 하지 않은 상태
        if(!response.payload.isAuth) {
          if(option) {  // if(option === true)
            navigate('/login')
          }
        } else {
          // 로그인 한 상태
          if(adminRoute && !response.payload.isAdmin) {
            navigate('/')
          } else {
              if(option === false)
                navigate('/')
          }
        }
      })

    }, [])

    return (
      <SpecificComponent />
    )
  }

  return <AuthenticationCheck />;
}

export default withAuthenticationCheck;