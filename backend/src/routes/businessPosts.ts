import { Request, Response, json } from "express";
import { validationResult } from "express-validator";
import { OkPacket } from "mysql";
import { v4 as uuidv4 } from "uuid";

import { Query, pool } from "../util/db";
import formatErrors from "../util/formatErrors";
import { getBlobClient } from "../util/storage";

export async function CreateBusinessPost(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatErrors(errors));
  }

  const postQuery =
    "INSERT INTO `posts` (`account_id`, `post_image`, `location_name`, `location_lat`, `location_long`, `caption`, `businessState`, `businessScheduleTime`, `created_at`, `updated_at`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

  const { ENVIRONMENT } = process.env;
  const { picture, caption, location, businessState, dateTime } = req.body;

  const pictureName = uuidv4();
  const pictureBuffer = Buffer.from(picture, "base64");

  const lognitude = 0.1;
  const latitude = 0.1;

  Promise.resolve()
    .then(() => validationResult(req)) // Validate the incoming http request
    .then((errors) => {
      if (!errors.isEmpty()) throw formatErrors(errors);
    })
    .then(() =>
      getBlobClient()
        .getContainerClient(ENVIRONMENT!)
        .getBlockBlobClient(pictureName)
    ) // get the container
    .then((blobBlockClient) =>
      blobBlockClient.upload(pictureBuffer, pictureBuffer.length)
    ) // upload the file to the container
    .then((uploadResponse) =>
      Query(postQuery, [
        1,
        `https://asdbackend.blob.core.windows.net/${ENVIRONMENT}/${pictureName}`,
        location,
        lognitude,
        latitude,
        caption,
        businessState,
        dateTime,
      ])
    )
    .then(() => res.status(201).json({ message: "Succesfully created post!" }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Failed to create post" });
    });
}
