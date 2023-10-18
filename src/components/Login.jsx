import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { client } from '../client';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

function Login() {
    const navigate = useNavigate();
    const [googleUser, setGoogleUser] = useState(null);
    const [profile, setProfile] = useState([]);

    const parseResponse = async () => {
        if (googleUser) {   
            let userObj = jwtDecode(googleUser.credential);
            console.log(userObj)
         
            localStorage.setItem('user', JSON.stringify(userObj))
            const { name, jti, picture } = userObj;
            const user = {
                _id: jti,
                _type: 'user',
                username: name,
                image: picture
            }
            client.createIfNotExists(user)
                .then(() => navigate('/', { replace: true }))
        }
    }
    useEffect(() => {
        parseResponse();
    }, [googleUser]);

    const responseGoogle = (response) => {
        setGoogleUser(response)
    };
    const errorGoogle = (error) => console.error(error);
    const login = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: errorGoogle
    });

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className="relative w-full h-full">
                <video src={shareVideo} type='video/mp4' loop content={false} muted autoPlay
                    className='w-full h-full object-cover'
                />
                <div className="absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} width="130px" alt='logo' />
                    </div>
                    <div className="shadow-2xl">
                        {/* <button type='button' className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                            onClick={() => login()}>
                            <FcGoogle className='mr-4' /> Sign in with Google
                        </button> */}
                        <GoogleLogin onSuccess={responseGoogle} onError={responseGoogle} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;