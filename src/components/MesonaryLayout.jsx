import React from 'react'
import Mesonry from 'react-masonry-css'
import Pin from './Pin'
const breakpoint = {
  default: 4,
  3000: 6,
  2000: 4,
  1200: 3,
  1000: 2,
  500: 1
}
function MesonaryLayout({ pins }) {
  return (
    <>
      {pins?.length ? (
        <Mesonry className='flex animate-slide-fwd' breakpointCols={breakpoint}>
          {pins?.map(pin => <Pin key={pin._id} pin={pin} className='w-max' />)}
        </Mesonry>

      ) :
        (
          <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
            No pins found
          </div>
        )
      }
    </>
  )
}

export default MesonaryLayout