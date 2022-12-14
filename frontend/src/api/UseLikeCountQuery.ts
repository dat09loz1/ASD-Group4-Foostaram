import axios from 'axios'
import { useMutation, useQuery } from 'react-query'
import GetEndpoint from './util/GetEndpoint'

export default function LikeCountQuery(post_id: number) {
	return useQuery(['likeCount', post_id], () =>
		axios
			.get(`${GetEndpoint('api')}/likeCount/${post_id}`)
			.then((res) => res)
	)
}