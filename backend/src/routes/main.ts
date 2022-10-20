import Router from "express-promise-router";
import { body, param } from "express-validator";

import { AuthenticateUser } from "../util/auth";
import { Block } from "./block";
import { EditProfile } from "./editprofile";
import { GetPosts } from "./feed";
import { Follow } from "./follow";
import { FollowerCount } from "./followerCount";
import { FollowingCount } from "./followingCount";
import { Hello } from "./hello";
import { Index } from "./index";
import { IsFollowing } from "./isfollowing";
import { Login } from "./login";
import { Me } from "./me";
import { SearchUsers, SearchPosts } from "./search";
import { PostCount } from "./postCount";
import { ProfilePosts } from "./profilePosts";
import { ProfilePic } from "./profilePic";
import { IsBlocking } from "./isblocking";
import { IsBlocked } from "./isBlocked";
import { CreatePost, DeletePost, UpdatePost } from "./post";
import { Profile } from "./profile";
import { Register } from "./register";
import { CreateBusinessPost, UpdateBusinessPost } from "./businessPosts";
import {
  GetBusinessPosts,
  GetIndividualBusinessPost,
} from "./getBusinessPosts";
import { GetCategories } from "./categories";

const router = Router();

router.get("/", Index);
//router.get('/*', GetAllPosts)

router.get("/hello", Hello);
router.get("/hello/:name", Hello);

router.post(
  "/register",
  body("email").isEmail(),
  body("fullName").isLength({ min: 5, max: 120 }),
  body("username").isLength({ min: 5, max: 80 }),
  body("password").isStrongPassword(),
  Register
);

router.get("/feed", AuthenticateUser, GetPosts);

router.post(
  "/posts",
  AuthenticateUser,
  body("picture").isLength({ min: 5 }),
  body("caption").isLength({ min: 5 }),
  body("location").isLength({ min: 5 }),
  CreatePost
);
router.put(
  "/posts/:post_id",
  AuthenticateUser,
  param("post_id").isNumeric(),
  body("caption").isLength({ min: 5 }),
  body("location").isLength({ min: 5 }),
  UpdatePost
);
router.delete(
  "/posts/:post_id",
  AuthenticateUser,
  param("post_id").isNumeric(),
  DeletePost
);

router.get("/me", AuthenticateUser, Me);

router.post("/login", body("email").isEmail(), body("password"), Login);

router.get("/profile/:username", Profile);
router.get("/postCount/:profileID", PostCount);
router.get("/followerCount/:profileID", FollowerCount);
router.get("/followingCount/:profileID", FollowingCount);
router.get("/profilePosts/:profileID", AuthenticateUser, ProfilePosts);

router.post(
  "/editprofile/:username",
  body("fullName").isLength({ min: 5, max: 120 }),
  body("username").isLength({ min: 5, max: 80 }),
  body("bio").isLength({ min: 5, max: 200 }),
  body("email").isEmail(),
  body("password").isStrongPassword(),
  body("phone").isLength({ min: 2, max: 15 }),
  AuthenticateUser,
  EditProfile
);

router.post(
  "/profilePic/:username",
  body("picture").isLength({ min: 5 }),
  ProfilePic
);

//search routes
router.post("/api/search_user", body("searchStr"), SearchUsers);
router.post("/api/search_post", body("searchStr"), SearchPosts);
//end search routes

router.get("/feed", AuthenticateUser, GetPosts);
router.post("/follow", body("account_to_follow"), AuthenticateUser, Follow);
router.post("/block", body("account_to_block"), AuthenticateUser, Block);
router.get("/isfollowing/:account_id", AuthenticateUser, IsFollowing);
router.get("/isblocking/:account_id", AuthenticateUser, IsBlocking);
router.get("/isBlocked/:account_id", AuthenticateUser, IsBlocked);

// Business posts
router.post(
  "/businessPosts",
  body("picture").isLength({ min: 5 }),
  body("caption").isLength({ min: 5 }),
  body("location").isLength({ min: 5 }),
  body("categories").isLength({ max: 300 }),
  AuthenticateUser,
  CreateBusinessPost
);

router.put(
  "/businessPosts/:post_id",
  param("post_id").isNumeric(),
  body("caption").isLength({ min: 5 }),
  body("location").isLength({ min: 5 }),
  body("businessState").isNumeric(),
  AuthenticateUser,
  UpdateBusinessPost
);

router.get("/viewBusinessPosts", AuthenticateUser, GetBusinessPosts);
router.get(
  "/viewBusinessPosts/:post_id",
  AuthenticateUser,
  GetIndividualBusinessPost
);

router.get("/categories", AuthenticateUser, GetCategories);

// End of business posts

export default router;
