import { Request, Response, json } from "express";
import { validationResult } from "express-validator";

import { Query } from "../util/db";
import formatErrors from "../util/formatErrors";

// import { validationResult } from 'express-validator'
// import formatErrors from '../util/formatErrors'
// Step 1: get the post IDs and post data based on the following account IDs (ID to reference is hardcoded for now)
// REPLACE 13 WITH LOGGED IN ACCOUNT ID

let feedQuery = `
SELECT
	P.post_id,
	A.username as username,
	profile_picture_url,
	image_url,
	location_name,
	location_lat,
	location_long,
	caption,
	created_at,
	updated_at,
	businessState,
	businessScheduleTime,
	categories,
	commentsCount,
	post_likes
FROM posts P
LEFT JOIN accounts A ON P.account_id = A.account_id
LEFT JOIN post_images PI ON P.post_id = PI.post_id
LEFT JOIN (
	SELECT
		C.post_id,
		COUNT(C.comment_id) as commentsCount
	FROM comments C
	GROUP BY (C.post_id)
) C ON P.post_id = C.post_id
LEFT JOIN (
	SELECT
		LP.post_id,
		COUNT(LP.account_id) as post_likes
	FROM liked_posts LP
	GROUP BY (LP.post_id)
) LP ON P.post_id = LP.post_id
WHERE A.account_id = ?
AND businessState IS NOT NULL
ORDER BY created_at DESC;
`;

interface BusinessPostsRow {
  post_id: number;
  username: string;
  profile_picture_url: string;
  image_url: string;
  location_name: string;
  location_lat: number;
  location_long: number;
  caption: string;
  created_at: Date;
  updated_at: Date;
  businessState: number;
  businessScheduleTime: Date;
  commentsCount: number;
  post_likes: number;
}
type BusinessPost = Omit<BusinessPostsRow, "image_url"> & {
  image_url: string[];
};

export async function GetBusinessPosts(req: Request, res: Response) {
  // Validates body of request to make sure it is following validation rules
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrors(errors));
  }

  // Gets the account ID from the request body
  const { account } = req;
  if (account === undefined) return res.status(500);

  const posts = (await Query(feedQuery, [
    account.account_id.toString(),
  ])) as BusinessPostsRow[];

  if (!posts.length) return res.json([]);

  // If commentsCount is null, set it to 0 or if post_likes is null, set it to 0
  const postsWithCommentsCount = posts.map((post) => {
    if (post.commentsCount === null) {
      post.commentsCount = 0;
    }
    if (post.post_likes === null) {
      post.post_likes = 0;
    }
    return post;
  });

  // group rows by post_id and merge the image_url together
  const map = new Map<number, BusinessPost>();
  postsWithCommentsCount.forEach((post) => {
    if (!map.has(post.post_id))
      return map.set(post.post_id, { ...post, image_url: [post.image_url] });
    map.get(post.post_id)!.image_url.push(post.image_url);
  });

  return res.status(200).json({ posts: [...map.values()] });
}

const individualPostQuery = `
SELECT
	P.post_id,
	location_name,
	image_url,
	caption,
	businessState,
	businessScheduleTime,
	created_at,
  categories
FROM posts P
LEFT JOIN post_images PI ON P.post_id = PI.post_id
LEFT JOIN accounts A ON P.account_id = A.account_id
WHERE A.account_id = ?
AND P.post_id = ?
AND businessState IS NOT NULL
ORDER BY created_at DESC;
`;
interface IndividualPostQueryRow {
  post_id: number;
  location_name: string;
  image_url: string;
  caption: string;
  businessState: number;
  businessScheduleTime: Date;
  created_at: Date;
}
type IndividualBusinessPost = Omit<IndividualPostQueryRow, "image_url"> & {
  image_url: string[];
};

export async function GetIndividualBusinessPost(req: Request, res: Response) {
  // Validates body of request to make sure it is following validation rules
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrors(errors));
  }

  // Gets the account ID from the request body
  const { account } = req;
  if (account === undefined) return res.status(500);

  // If no post_id is provided, return an error
  const { post_id } = req.params;
  if (post_id === undefined) return res.status(500);

  const posts = (await Query(individualPostQuery, [
    account.account_id.toString(),
    post_id,
  ])) as IndividualPostQueryRow[];
  if (!posts.length) return res.json([]);

  // group rows by post_id and merge the image_url together
  const map = new Map<number, IndividualBusinessPost>();
  posts.forEach((post) => {
    if (!map.has(post.post_id)) {
      post.businessScheduleTime = new Date(post.businessScheduleTime);
      post.businessScheduleTime.setHours(
        post.businessScheduleTime.getHours() + 11
      );
      return map.set(post.post_id, { ...post, image_url: [post.image_url] });
    }
    map.get(post.post_id)!.image_url.push(post.image_url);
  });

  return res.status(200).json({ post: [...map.values()] });
}
