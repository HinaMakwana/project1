import React from 'react'
import Sidebar from '../components/sidebar'
import DropDownProfile from '../components/dropDownProfile'

function Dashboard() {
	return (
		<div className='flex'>
			<div>
				<Sidebar />
			</div>
			<div>
				<div className='py-3 mt-10 rounded-lg mx-10 sm:mx-14 shadow-2xl px-10 flex justify-end'>
					<DropDownProfile />
				</div>
				<div>

				</div>
			</div>
		</div>
	)
}

export default Dashboard