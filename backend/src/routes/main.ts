import Router from 'express-promise-router'
import { body, param } from 'express-validator'

import { AuthenticateUser } from '../util/auth'
import { EditProfile } from './editprofile'
import { FollowerCount } from './followerCount'
import { FollowingCount } from './followingCount'
import { Hello } from './hello'
import { Index } from './index'
import { Login } from './login'
import { Me } from './me'
import { SearchUsers, SearchPosts } from './search'
import { PostCount } from './postCount'
import { ProfilePosts } from './profilePosts'
import { GetPosts } from './feed'
import { Follow } from './follow'
import { Block } from './block'
import { ProfilePic } from './profilePic'
import { IsFollowing } from './isfollowing'
import { CreatePost, DeletePost, UpdatePost } from './post'
import { Profile } from './profile'
import { Register } from './register'

const router = Router()

router.get('/', Index)
//router.get('/*', GetAllPosts)

router.get('/hello', Hello)
router.get('/hello/:name', Hello)

router.post(
	'/register',
	body('email').isEmail(),
	body('fullName').isLength({ min: 5, max: 120 }),
	body('username').isLength({ min: 5, max: 80 }),
	body('password').isStrongPassword(),
	Register
)

router.get('/feed', AuthenticateUser, GetPosts)

router.post(
	'/posts',
	body('picture').isLength({ min: 5 }),
	body('caption').isLength({ min: 5 }),
	body('location').isLength({ min: 5 }),
	CreatePost
)
router.put(
	'/posts/:post_id',
	param('post_id').isNumeric(),
	body('caption').isLength({ min: 5 }),
	body('location').isLength({ min: 5 }),
	AuthenticateUser,
	UpdatePost
)
router.delete(
	'/posts/:post_id',
	param('post_id').isNumeric(),
	AuthenticateUser,
	DeletePost
)

router.get('/me', AuthenticateUser, Me)

router.post('/login', body('email').isEmail(), body('password'), Login)

router.get('/profile/:username', Profile)
router.get('/postCount/:profileID', PostCount)
router.get('/followerCount/:profileID', FollowerCount)
router.get('/followingCount/:profileID', FollowingCount)
router.get('/profilePosts/:profileID', AuthenticateUser, ProfilePosts)

router.post(
	'/editprofile/:username',
	body('email').isEmail(),
	body('fullName').isLength({ min: 5, max: 120 }),
	body('bio').isLength({ min: 5, max: 200 }),
	body('username').isLength({ min: 5, max: 80 }),
	body('phone').isLength({ min: 2, max: 15 }),
	AuthenticateUser,
	EditProfile
)

router.post(
	'/profilePic/:username',
	body('picture').isLength({ min: 5 }),
	ProfilePic
)

//search routes
router.post('/api/search_user', body('searchStr'), SearchUsers)
router.post('/api/search_post', body('searchStr'), SearchPosts)
//end search routes

router.get('/feed', AuthenticateUser, GetPosts)
router.post('/follow', body('account_to_follow'), AuthenticateUser, Follow)
router.post('/block', body('account_to_block'), AuthenticateUser, Block)
router.get('/isfollowing/:account_id', AuthenticateUser, IsFollowing)

export default router
