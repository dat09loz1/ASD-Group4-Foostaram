import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import styles from '../styles/Profile.module.css'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Form from '../components/form/Form'
import UseProfileQuery from '../api/UseProfileQuery'
import UseEditProfileMutation from '../api/UseEditProfileMutation'
import InputFieldProfile from '../components/form/InputFieldProfile'
import SubmitButtonProfile from '../components/form/SubmitButtonProfile'
import useAuth from '../api/util/useAuth'
import { AxiosError } from 'axios'
import { ProfilePic, UseProfilePicMutation } from '../api/UseProfilePicMutation'
import InputField from '../components/form/InputField'
import SubmitButton from '../components/form/SubmitButton'
import SubmitButtonProfilePic from '../components/form/SubmitButtonProfilePic'
import { useQueryClient } from 'react-query'
import UseDeleteProfileMutation from '../api/UseDeleteProfileMutation'
import DeleteProfileButton from '../components/form/DeleteProfileButton'

const EditProfile = () => {
	const [account, isLoading] = useAuth()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const profileQuery = UseProfileQuery(account.username as string)
	const editProfileMutation = UseEditProfileMutation(account.username as string)
	if (editProfileMutation.isError) {
		console.log(editProfileMutation.error)
	}
	const deleteProfileMutation = UseDeleteProfileMutation()
	if (deleteProfileMutation.isError) {
		console.log(deleteProfileMutation.error)
	}
	if (deleteProfileMutation.isSuccess) {
		navigate('/logout')
	}
	const profilePicMutation = UseProfilePicMutation(
		queryClient,
		account.username as string
	)
	const picture = useRef<HTMLInputElement>(null)
	const _picture = useRef<HTMLInputElement>(null)
	const [imgUploaded, setImageUploaded] = useState(false)
	const img = useRef<HTMLImageElement>(null)
	const onPictureSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader()
		let filetype = ((e.target as HTMLInputElement).files![0] as unknown as File)
			.name
		if (filetype.endsWith('.png')) {
			new Promise((resolve, reject) => {
				reader.readAsDataURL(
					(e.target as HTMLInputElement).files![0] as unknown as File
				)
				reader.onload = () => resolve(reader.result)
				reader.onerror = (error) => reject(error)
			})
				.then((base64string) =>
					(base64string as string).slice('data:image/png;base64'.length)
				)
				.then((base64image) => {
					setImageUploaded(true)
					picture.current!.value = base64image
					setShowpreview(true)
					if (img.current)
						img.current!.src = `data:image/png;base64${base64image}`
				})
		} else {
			new Promise((resolve, reject) => {
				reader.readAsDataURL(
					(e.target as HTMLInputElement).files![0] as unknown as File
				)
				reader.onload = () => resolve(reader.result)
				reader.onerror = (error) => reject(error)
			})
				.then((base64string) =>
					(base64string as string).slice('data:image/jpeg;base64'.length)
				)
				.then((base64image) => {
					setImageUploaded(true)
					picture.current!.value = base64image
					setShowpreview(true)
					if (img.current)
						img.current!.src = `data:image/jpeg;base64${base64image}`
				})
		}
	}

	const [showPreview, setShowpreview] = useState(false)
	const onResetButtonClicked = () => {
		_picture.current!.files = null // clear the file input
		picture.current!.value = '' // clear the hidden input (base64)
		img.current!.removeAttribute('src') // clear the picture
	}

	return (
		<div className="relative max-w-2xl mx-auto my-3">
			{profileQuery.isLoading == false && (
				<>
					<div className="flex flex-col justify-center items-center my-5">
						<h1 className="text-3xl font-semibold py-3">Edit your profile</h1>

						{editProfileMutation.isError && (
							<div className="my-6 bg-red-300 rounded-lg p-4 text-center">
								{`Failed to update account. ${
									editProfileMutation.error instanceof AxiosError &&
									editProfileMutation.error?.response?.status === 400
										? editProfileMutation.error.response.data.message
										: ''
								}`}
							</div>
						)}

						{editProfileMutation.isSuccess && (
							<div className="my-6 bg-green-300 rounded-lg p-4 text-center">
								Profile edits saved!
							</div>
						)}

						<div className="grid grid-cols-4 p-3 mb-4">
							<div></div>
							<div className="place-self-center px-4">
								<img
									className="h-20 w-20 object-cover rounded-full place-items-center"
									src={profileQuery.data?.data.data.profile_picture_url}
									alt="Current profile photo"
								/>
							</div>
							<div className="block pt-2 place-self-end self-center font-semibold">
								<Form
									onSubmit={(data) => {
										profilePicMutation.mutate(data as unknown as ProfilePic)
										onResetButtonClicked()
									}}
								>
									<div className="grid grid-cols-1 text-sm">
										<div className="">
											<input
												ref={_picture}
												onChange={onPictureSelected}
												type="file"
												accept=".png, .jpg, .jpeg"
												name="_picture"
												required
												className="mb-2"
											/>
											{/*<button onClick={onResetButtonClicked}>Clear</button>*/}
											<img ref={img} className="w-full" />
											<input ref={picture} hidden name="picture" />
										</div>
										<div className="">
											{imgUploaded === true && (
												<>
													<SubmitButtonProfilePic
														text="Upload"
														loading={profilePicMutation.isLoading}
													/>
												</>
											)}
										</div>
									</div>
								</Form>
							</div>
						</div>

						<Form
							onSubmit={(data) => {
								editProfileMutation.mutate({
									fullName: data['fullName'],
									username: data['username'],
									bio: data['bio'],
									email: data['email'],
									password: data['password'],
									phone: data['phone'],
								})
							}}
						>
							<label className="relative block p-3 bg-gray-100 rounded-2xl">
								<span className="text-md font-semibold text-zinc-900">
									Username
								</span>
								<InputFieldProfile
									placeholder="Username"
									name="username"
									initialValue={profileQuery.data?.data.data.username}
								/>
							</label>

							<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
								<span className="text-md font-semibold text-zinc-900">
									Name
								</span>
								<InputFieldProfile
									placeholder="Full Name"
									name="fullName"
									initialValue={profileQuery.data?.data.data.name}
								/>
							</label>

							<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
								<span className="text-md font-semibold text-zinc-900">
									Profile description
								</span>
								<InputFieldProfile
									placeholder="Bio"
									name="bio"
									initialValue={profileQuery.data?.data.data.bio}
								/>
							</label>

							<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
								<span className="text-md font-semibold text-zinc-900">
									Email
								</span>
								<InputFieldProfile
									placeholder="Email address"
									type="email"
									name="email"
									initialValue={profileQuery.data?.data.data.email}
								/>
							</label>

							<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
								<span className="text-md font-semibold text-zinc-900">
									Password
								</span>
								<InputFieldProfile
									placeholder="Password"
									type="password"
									name="password"
									initialValue={profileQuery.data?.data.data.password_hash}
								/>
							</label>

							<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
								<span className="text-md font-semibold text-zinc-900">
									Phone Number
								</span>
								<InputFieldProfile
									placeholder="Phone number"
									name="phone"
									initialValue={profileQuery.data?.data.data.phone}
								/>
							</label>

							<div className="flex space-x-4 justify-center my-5">
								<SubmitButtonProfile text="Save" />
								<Link to={`/profile/${account.username}`}>
									<button className="px-5 py-2 font-semibold text-sm border border-gray-400 rounded">
										Back to profile
									</button>
								</Link>
							</div>
						</Form>

						<div className="border-solid border-2 border-red-500 p-5 rounded-2xl mt-5 ">
							<h2 className="text-2xl font-semibold text-center">
								Delete account
							</h2>

							{deleteProfileMutation.isError && (
								<div className="my-6 bg-red-300 rounded-lg p-4 text-center">
									{`Incorrect password ${
										editProfileMutation.error instanceof AxiosError &&
										editProfileMutation.error?.response?.status === 400
											? editProfileMutation.error.response.data.message
											: ''
									}`}
								</div>
							)}

							{deleteProfileMutation.isSuccess && (
								<div className="my-6 bg-green-300 rounded-lg p-4 text-center">
									Account deleted, you'll be redirected shortly
								</div>
							)}

							<Form
								onSubmit={(data) => {
									deleteProfileMutation.mutate({
										username: account.username,
										password: data['password'],
									})
								}}
							>
								<label className="relative block p-3 bg-gray-100 rounded-2xl mt-5">
									<span className="text-md font-semibold text-zinc-900">
										Current password
									</span>
									<InputFieldProfile
										placeholder="Password"
										type="password"
										name="password"
									/>
								</label>
								<div className="flex space-x-4 justify-center mt-5">
									<DeleteProfileButton text="Delete account" />
								</div>
							</Form>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default EditProfile
