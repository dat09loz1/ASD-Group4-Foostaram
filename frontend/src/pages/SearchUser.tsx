// import styles from "../styles/Search.module.css";
import { useParams } from 'react-router-dom'

import UseSearchUserMutation from '../api/UseSearchUserMutation';
import useAuth from '../api/util/useAuth'
import styles from '../styles/Feed.module.css'
import { Link } from 'react-router-dom'
import { useEffect } from 'react';


const SearchUser = () => {
  const [account, isLoading] = useAuth()
  const { searchStr } = useParams();
  const searchUserMutation = UseSearchUserMutation()

  useEffect(() => {
    if (searchStr !== undefined && searchStr !== "") {
      searchUserMutation.mutate({
        searchStr: searchStr,
      })
    }
  }, [searchStr])

  let users = searchUserMutation.data?.data.data

  return (
    <>
      <h1 className='text-justify text-2xl px-48'>Search results for '{searchStr}'</h1>
      
      <div>
        {//no results
          users === undefined || users.length == 0 && (
            <h1 className='mx-auto block w-2/3 text-center mt-[200px] mb-[200px] text-xl text'>
              No results
            </h1>
          )
        }

        {//user results
          users !== undefined && users.length > 0 && 
          users.map((user:any) => {
            return (
              <div className="m-3 w-4/5 h-full ml-auto mr-auto flex max-w-[640px]">
                <div className={`flex-auto w-14`}>
                  <Link to={`/profile/${user.item.username}`}>
                    <div key={user.item.username} className={`py-3 px-8 bg-white hover:bg-gray-100 border ${styles.greyBorder}`}>
                      <div className="flex items-center">
                        <img
                          alt="avatar"
                          className="w-12 h-12 rounded-full border-2 border-gray-700 inline-block align-middle object-cover"
                          src={user.item.profile_picture_url}
                        />
                        <p className='px-3'>{user.item.name}</p>
                        <p className='text-stone-500 text-right'>@{user.item.username}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })
        }

      </div>
    </>
  )
}

export default SearchUser