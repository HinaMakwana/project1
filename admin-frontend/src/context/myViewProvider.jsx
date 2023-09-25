import React, { useState } from 'react'
import MyContext from './myContext'

function MyViewProvider(props) {
	let [view,setView] = useState(false);
	const changeView = () => {
		if(view) {
			setView(false);
		} else {
			setView(true);
		}
	}
	return (
		<MyContext.Provider value={{view,changeView}}>
			{props.children}
		</MyContext.Provider>
	)
}

export default MyViewProvider