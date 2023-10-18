import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { urlFor, client } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser } from '../utils/fetchUser';
function Pin({ pin }) {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const alreadySaved = !!pin?.save?.filter(item => item.postedBy?._id === user?.jti)?.length;
    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);
            client.patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidV4(),
                    userId: user?.jti,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.jti
                    }
                }]).commit().then(() => {
                    window.location.reload();
                });
        }
    }
    const deletePin = (id) => {
        client.delete(id).then(() => window.location.reload)
    }
    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${pin?._id}`)}
                className='relative cursor-zoom-in w-auto shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'>
                <img className='rounded-lg w-full' alt={pin?.title} src={urlFor(pin?.image).width(250).url()} />
                {postHovered && <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                    style={{ height: '100%' }}
                >
                    {/*  */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <a href={`${pin?.image?.asset?.url}?dl=`} download
                                onClick={e => e.stopPropagation()} className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark tex-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                                <MdDownloadForOffline /> </a>
                        </div>
                        {alreadySaved ? (
                            <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white px-5 py-1 text-base font-bold rounded-3xl hover:shadow-md outline-none flex gap-2'>
                                {pin?.save?.length}Saved</button>
                        ) : (
                            <button type='button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(pin?._id)
                                }}
                                className='bg-red-500  opacity-70 hover:opacity-100 text-white px-5 py-1 text-base font-bold rounded-3xl hover:shadow-md outline-none'>Save</button>
                        )
                        }
                    </div>
                    <div className='flex justify-between items-center w-full'>
                        {pin?.destination && <a href={pin?.destination} target='_blank' rel='noreferrer'
                            className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md' onClick={e => e.stopPropagation()}>
                            <BsFillArrowUpRightCircleFill /> {pin?.destination?.slice(8)}
                        </a>}
                        {pin?.postedby?._id === user?.jti && (
                            <button type='button' className='bg-white p-2 opacity-70 hover:opacity-100 text-dark text-base font-bold rounded-3xl hover:shadow-md outline-none' onClick={e => {
                                e.stopPropagation();
                                deletePin(pin?._id)
                            }}>
                                <AiTwotoneDelete />
                            </button>
                        )}
                    </div>
                </div>
                }
            </div>
            <Link to={`/user-profile/${pin?.postedby?._id}`} className='flex gap-2 mt-2 items-center'>
                <img className='w-8 h-8 rounded-full object-cover' src={pin?.postedby?.image} alt='user-profile' />
                <p className="font-semibold capitalized">{pin?.postedby?.username}</p>
            </Link>
        </div>
    )
}

export default Pin