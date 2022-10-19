import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UseBusinessPostQuery from '../../api/UseBusinessPostQuery'
import { UseDeletePostMutation } from '../../api/UsePostMutation'
import useAuth from '../../api/util/useAuth'
import ManagePublishedPostTableRow from '../../components/business/ManagePublishedPostTableRow'
import Spinner from '../../components/common/Spinner'
import ManageScheduledPostTableRow from '../../components/business/ManageScheduledPostTableRow'
import ManageDraftPostTableRow from '../../components/business/ManageDraftsPostTableRow'

const ManagePosts = () => {
	const [openTab, setOpenTab] = useState('published')

	const [account, isLoading] = useAuth()
	let viewPostsQuery = UseBusinessPostQuery()

	const [publishedTable, setPublishedTable] = useState<any>()
	const [scheduleTable, setScheduleTable] = useState<any>()
	const [draftTable, setDraftTable] = useState<any>()

	let deleteMutation = UseDeletePostMutation()

	let generatePublishedTable = () => {
		if (viewPostsQuery.isSuccess) {
			let data = viewPostsQuery.data.data.posts

			let generatedTable: any[] = []
			if (data !== undefined) {
				data.forEach((element: any) => {
					if (element.businessState == 1) {
						// image: string, title: string, datePublished: string, username: string, post_id: number, likes: number, comments: number, views: number
						generatedTable.push(
							<ManagePublishedPostTableRow
								image={element.post_image}
								title={element.caption}
								datePublished={element.updated_at}
								username={element.username}
								post_id={element.post_id}
								likes={100}
								comments={100}
								views={100}
								deletePost={deleteFunction}
								profilePicture={element.profile_picture_url}
								updatePost={updateFunction}
							/>
						)
					}
				})
			}

			setPublishedTable(generatedTable)
		}
	}

	let generateScheduledTable = () => {
		if (viewPostsQuery.isSuccess) {
			let data = viewPostsQuery.data.data.posts
			let generatedTable: any[] = []
			if (data !== undefined) {
				data.forEach((element: any) => {
					if (element.businessState == 2) {
						generatedTable.push(
							<ManageScheduledPostTableRow
								image={element.post_image}
								title={element.caption}
								dateScheduled={element.businessScheduleTime}
								username={element.username}
								post_id={element.post_id}
								deletePost={deleteFunction}
								profilePicture={element.profile_picture_url}
								updatePost={updateFunction}
							/>
						)
					}
				})
			}

			setScheduleTable(generatedTable)
		}
	}

	let generateDraftTable = () => {
		if (viewPostsQuery.isSuccess) {
			let data = viewPostsQuery.data.data.posts
			let generatedTable: any[] = []
			if (data !== undefined) {
				data.forEach((element: any) => {
					if (element.businessState == 3) {
						generatedTable.push(
							<ManageDraftPostTableRow
								image={element.post_image}
								title={element.caption}
								dateCreated={element.created_at}
								username={element.username}
								post_id={element.post_id}
								deletePost={deleteFunction}
								profilePicture={element.profile_picture_url}
								updatePost={updateFunction}
							/>
						)
					}
				})
			}

			setDraftTable(generatedTable)
		}
	}

	let deleteFunction = (post_id: number) => {
		deleteMutation.mutate({ post_id: post_id })
		window.location.reload()
	}

	const navigate = useNavigate()

	let updateFunction = (post_id: number) => {
		navigate(`/updateposts/${post_id}`)
	}

	useEffect(() => {
		generatePublishedTable()
		generateScheduledTable()
		generateDraftTable()
	}, [viewPostsQuery.isFetchedAfterMount])

	return (
		<div className="mx-16">
			{viewPostsQuery.isLoading ||
				(isLoading && (
					<div className="h-[600px]">
						<Spinner />
					</div>
				))}

			<div className="my-3">
				{/* View by Published, Schedule or Draft */}
				<div className="flex items-center justify-start py-4 border-b-[1px] border-light-gray">
					<div>
						<button
							className={`font-semibold py-1 px-2 rounded-sm mx-2 opacity-50 hover:opacity-100 ${
								openTab == 'published'
									? 'bg-insta-light-blue text-insta-dark-blue hover:bg-insta-light-blue-hover'
									: 'bg-slate-100'
							}`}
							onClick={() => setOpenTab('published')}
						>
							Published
						</button>
					</div>
					<div>
						<button
							className={`font-semibold py-1 px-2 rounded-sm mx-2 opacity-50 hover:opacity-100 ${
								openTab == 'scheduled'
									? 'bg-insta-light-blue text-insta-dark-blue hover:bg-insta-light-blue-hover'
									: 'bg-slate-100'
							}`}
							onClick={() => setOpenTab('scheduled')}
						>
							Scheduled
						</button>
					</div>
					<div>
						<button
							className={`font-semibold py-1 px-2 rounded-sm mx-2 opacity-50 hover:opacity-100 ${
								openTab == 'drafts'
									? 'bg-insta-light-blue text-insta-dark-blue hover:bg-insta-light-blue-hover'
									: 'bg-slate-100'
							}`}
							onClick={() => setOpenTab('drafts')}
						>
							Drafts
						</button>
					</div>
				</div>

				{/* Show Posts Search Bar */}
				<div className="flex items-center justify-between py-4">
					<select>
						<option>Photos</option>
						<option>Videos</option>
					</select>
					<div className="flex items-center justify-end">
						{/* <div className="flex justify-end items-center relative mr-2">
              <input
                className="w-full pl-12 pr-2 border-[1px] border-light-gray py-2 rounded-md"
                type="text"
                placeholder="Search Artwork / Creators Name"
              />
              <FontAwesomeIcon
                className="absolute w-5 h-5 left-2 pointer-events-none"
                icon={solid("search")}
              />
            </div> */}
						<Link to="/scheduleposts">
							<div className="flex items-center justify-end relative">
								<button className="px-10 bg-insta-green rounded-[5px] text-white p-2 opacity-90 hover:opacity-100">
									Create Post
								</button>
								{/* <FontAwesomeIcon
                  className="absolute w-5 h-5 left-2 pointer-events-none text-white"
                  icon={solid("table")}
                /> */}
							</div>
						</Link>
					</div>
				</div>

				{openTab == 'published' && (
					<table className="table-fixed w-full overflow-hidden">
						<thead>
							<tr>
								<th colSpan={1}></th>
								<th className="text-left" colSpan={8}>
									<p className="text-sm font-semibold mr-2">Title</p>
								</th>
								<th className="text-left" colSpan={4}>
									<p className="text-sm font-semibold mr-2">Date published</p>
								</th>
								<th className="text-left" colSpan={4}>
									<div className="flex items-center justify-start">
										<p className="text-sm font-semibold mr-2">Reach</p>
										{/* <FontAwesomeIcon
                      className="text-gray-900"
                      icon={solid("circle-info")}
                    /> */}
									</div>
								</th>
								<th className="text-left" colSpan={4}>
									<div className="flex items-center justify-start">
										<p className="text-sm font-semibold mr-2">Engagements</p>
										{/* <FontAwesomeIcon
                      className="text-gray-900"
                      icon={solid("circle-info")}
                    /> */}
									</div>
								</th>
								<th className="text-left" colSpan={4}>
									<div className="flex items-center justify-start">
										<p className="text-sm font-semibold mr-2">
											Likes and reactions
										</p>
										{/* <FontAwesomeIcon
                      className="text-gray-900"
                      icon={solid("circle-info")}
                    /> */}
									</div>
								</th>
								<th className="text-left" colSpan={4}>
									<div className="flex items-center justify-start">
										<p className="text-sm font-semibold mr-2">Comments</p>
										{/* <FontAwesomeIcon
                      className="text-gray-900"
                      icon={solid("circle-info")}
                    /> */}
									</div>
								</th>
							</tr>
						</thead>
						<tbody>{publishedTable}</tbody>
					</table>
				)}

				{openTab == 'scheduled' && (
					<table className="table-fixed w-full overflow-hidden">
						<thead>
							<tr>
								<th colSpan={1}></th>
								<th className="text-left" colSpan={8}>
									<p className="text-sm font-semibold mr-2">Title</p>
								</th>
								<th className="text-left" colSpan={4}>
									<p className="text-sm font-semibold mr-2">Date scheduled</p>
								</th>
								<th className="text-left" colSpan={4}>
									<p className="text-sm font-semibold mr-2">Created by</p>
								</th>
							</tr>
						</thead>
						<tbody>{scheduleTable}</tbody>
					</table>
				)}

				{openTab == 'drafts' && (
					<table className="table-fixed w-full overflow-hidden">
						<thead>
							<tr>
								<th colSpan={1}></th>
								<th className="text-left" colSpan={8}>
									<p className="text-sm font-semibold mr-2">Title</p>
								</th>
								<th className="text-left" colSpan={4}>
									<p className="text-sm font-semibold mr-2">Date created</p>
								</th>
								<th className="text-left" colSpan={4}>
									<p className="text-sm font-semibold mr-2">Created by</p>
								</th>
							</tr>
						</thead>
						<tbody>{draftTable}</tbody>
					</table>
				)}
			</div>
		</div>
	)
}

export default ManagePosts
