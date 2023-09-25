import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
	let [email,setEmail] = useState('');
	let [password,setPassword] = useState('');
	let navigate = useNavigate();
	const handleSubmit = async () => {
		console.log(email,password);
		let response = await fetch("http://localhost:1337/admin/login",{
			method: 'POST',
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
		let res = await response.json();
		console.log(response);
		if(res.status === 400) {
			toast.error(res.message,{
				position: 'top-right'
			})
		} else if(res.status === 404) {
			toast.error(res.message,{
				position: 'top-right'
			})
		} else if(res.status === 200) {
			toast.success(res.message,{
				position: 'top-right'
			});
			localStorage.setItem("authToken",res.token)
			navigate('/dashboard')
		}
	}
	return (
		<div>
			<div className='mt-40'>
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">

						<h1 className="mt-10 text-center text-4xl font-semibold leading-9 tracking-tight text-gray-900">
							Login Form
						</h1>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
							<div>
								<label htmlFor="email" className="block text-base font-semibold leading-6 text-gray-900">
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										placeholder='xyz@gmail.com'
										required
										onChange={(e)=> {setEmail(e.target.value)}}
										className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label htmlFor="password" className="block text-base font-semibold leading-6 text-gray-900">
										Password
									</label>
									<div className="text-sm">
										<a href="#" className="font-semibold text-cyan-700 hover:text-cyan-700">
											Forgot password?
										</a>
									</div>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										required
										onChange={(e)=> {setPassword(e.target.value)}}
										className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									onClick={handleSubmit}
									className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
								>
									Login
								</button>
							</div>
					</div>
				</div>
			</div>
		</div>

	)
}

export default Login