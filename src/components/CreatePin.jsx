import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { client } from '../client'
import { useNavigate, usenavigate } from 'react-router-dom'
import { categories } from '../utils/data';
import Spinner from './Spinner';

function CreatePin({ user }) {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(null)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    if (['image/png', 'image/svg', 'image/jpeg', 'image/gif', 'image/tiff'].includes(selectedFile.type)) {
      setWrongImageType(false);
      setLoading(true);

      client.assets.upload('image', selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name
      })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false)
        }).catch(err => console.error('failed to upload image'))
    } else {
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userid: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category
      }
      client.create(doc)
        .then(() => {
          navigate('/');
        })
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false)
      }, 2000);
    }
  }

  return (
    <div className='flex justify-center items-center mt-5 lg:h-4/5'>
      {fields && <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
        Please fill all fields</p>}
      {/* Image upload */}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0 7 w-full">
          <div className="flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (<label>

              <div className="flex justify-center items-center h-full flex-col">
                <div className="flex justify-center items-center h-full flex-col">
                  <p className="font-bold text-2xl">
                    <AiOutlineCloudUpload />
                  </p>
                  <p className="text-lg">Click To Upload</p>
                </div>
                <p className="mt-32 text-gray-400">
                  Recommendation: use high-quality JPG, PNG, GIF, TIFF, or SVG less than 20mb
                </p>
              </div>
              <input type='file' className='w-0 h-0' onChange={e => uploadImage(e)} name='upload-image' />
            </label>
            )
              : (
                <div className='relative w-full'>
                  <img src={imageAsset?.url} alt='uploaded-image' className='w-full h-full' />
                  <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )
            }
          </div>
        </div>
        {/* Remaining fields */}
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input type='text' value={title} onChange={e => setTitle(e.target.value)}
            placeholder='Add your title' className='outline-none text-xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2' />
          {user && <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
            <img src={user.image} className='w-10 h-10 rounded-full' />
            <p className="font-bold">{user.userName}</p>
          </div>}
          <input type='text' value={about} onChange={e => setAbout(e.target.value)}
            placeholder='Whate is you pin about?' className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2' />

          <input type='text' value={destination} onChange={e => setDestination(e.target.value)}
            placeholder='Add a destination link' className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2' />

          <div className="flex flex-col">
            <p className="mb-2 font-semibold text-lg sm:text-xl">
              Choose pin category
            </p>

            <select onChange={e => setCategory(e.target.value)} className='outline-none w-4/5 text-base border-b-2  border-gray-200 p-2 rounded-md cursor-pointer'>
              <option value='other' className='bg-white'>select category</option>
              {categories.map(cat => (
                <option className='text-base border-0 outline-none capitalize bg-white text-black' value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end items-end mt-5">
            <button type='button' onClick={savePin} className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'>
              Save Pin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin