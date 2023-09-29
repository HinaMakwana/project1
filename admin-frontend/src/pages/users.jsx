import React, { useEffect } from 'react'
import Sidebar from '../components/sidebar'
import DropDownProfile from '../components/dropDownProfile'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../redux/features/users/userSlice'

function Users() {
	const dispatch = useDispatch();
	const data = useSelector(state => state.users.data)
	console.log(data);
	useEffect(()=> {
		dispatch(getUsers());
	},[])
	return (
		<div className='flex'>
			<div>
				<Sidebar />
			</div>
			<div>
				<div className="py-3 mt-10 rounded-lg mx-10 sm:mx-14 shadow-2xl px-10 flex justify-end">
					<DropDownProfile />
				</div>
				<div>

				</div>
			</div>
		</div>
	)
}

export default Users