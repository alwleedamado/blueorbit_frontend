import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MesonaryLayout from './MesonaryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'

function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams();
  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query)
        .then(res => {
          setPins(res);
          setLoading(false)
        })
    } else {
      client.fetch(feedQuery)
        .then(res => {
          setPins(res);
          console.log(res)
          setLoading(false)
        })
    }
  }, [categoryId])
  if (loading) return <Spinner message='We are filling your feed with images' />
  return (
    <div>
      {pins && <MesonaryLayout pins={pins} />}
    </div>
  )
}

export default Feed