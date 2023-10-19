import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { userQuery, userSavedPinsQuery, userCreatedPinsQuery } from '../utils/data';
import { googleLogout } from '@react-oauth/google';
import { client } from '../client';
import MesonaryLayout from './MesonaryLayout';
import Spinner from './Spinner';

const randomSplash = 'https://source.unsplash.com/random/1600x900/?nature,photography,technology';
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4  text-black font-bold p-2 rounded-full w-20 outline-none';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('Created');
  const navigate = useNavigate();
  const { userId } = useParams();
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');
  }
  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
  }, [userId])

  useEffect(() => {
    let query = '';
    if (text === 'Created') {
      query = userCreatedPinsQuery(userId);
    } else if (text === 'Saved') {
      query = userSavedPinsQuery(userId);
    }
    client.fetch(query)
      .then(data => {
        console.log(data)
        setPins(data)
      })
  }, [text, userId])

  if (!user) return <Spinner message='Loading profile' />
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={randomSplash} className='w-full h-370 2xl:h-610 shadow-lg object-cover' alt='splash screen' />
            <img className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' src={user?.image} />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user?._id && <button type='button' className='bg-white rounded-full shadow-md outline-none p-2' onClick={logout}>
                <AiOutlineLogout color='red' fontSize={21} />
              </button>}
            </div>
          </div>
          <div className="text-center mb-7">
            <button type="button"
              onClick={e => {
                setText(e.target.textContent);
                setActiveBtn('Created');
              }}
              className={`${activeBtn === 'Created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button type="button"
              onClick={e => {
                setText(e.target.textContent);
                setActiveBtn('Saved');
              }}
              className={`${activeBtn === 'Saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          <div className="px-2">
            <MesonaryLayout pins={pins} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile