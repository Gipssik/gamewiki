import React, {FC, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styles from './Navbar.module.css';
import {Logo} from "../Logo";
import {LoginOutlined, LogoutOutlined, PlusCircleOutlined, UserOutlined} from "@ant-design/icons";
import {authActions, useAppDispatch, useAppSelector} from "../../store";

type Page = {
	title: string,
	path: string
}

const pages: Page[] = [
	{title: "Companies", path: "/companies"},
	{title: "Platforms", path: "/platforms"},
	{title: "Genres", path: "/genres"},
	{title: "Games", path: "/games"},
	{title: "Sales", path: "/sales"},
	{title: "Backups", path: "/backups"},
]

const userIcon = {
	fontSize: "150%",
}

const Navbar: FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const {me, isAuth} = useAppSelector(s => s.auth)
	const checkbox = useRef<HTMLInputElement>(null)

	const signOut = () => {
		dispatch(authActions.logout())
		navigate('/sign-in')
	}

	const onNavbarLinkClick = () => {
		if(checkbox && checkbox.current && window.innerWidth < 1280)
			checkbox.current.checked = !checkbox.current.checked
	}

	return (
		<header className={styles.header}>
			<Logo/>
			<input ref={checkbox} type="checkbox" id="menu-btn"/>
			<label htmlFor="menu-btn"><span></span></label>
			<ul className={styles.menu}>
				{
					me && me.is_superuser ?
						<li onClick={onNavbarLinkClick}>
							<Link to={'/users'}>Users</Link>
						</li>
						:
						null
				}
				{
					pages.map(x => <li onClick={onNavbarLinkClick} key={x.path}><Link to={x.path}>{x.title}</Link></li>)
				}
				{
					isAuth ?
						<>
							<li onClick={onNavbarLinkClick}>
								<Link to="/account"><UserOutlined style={userIcon} /> {me?.username}</Link>
							</li>
							<li onClick={onNavbarLinkClick}>
								<a onClick={signOut}><LogoutOutlined style={userIcon} /> Sign Out</a>
							</li>
						</>
						:
						<>
							<li onClick={onNavbarLinkClick}>
								<Link to="/sign-in"><LoginOutlined style={userIcon}/>Sign In</Link>
							</li>
							<li onClick={onNavbarLinkClick}>
								<Link to="/sign-up"><PlusCircleOutlined style={userIcon} />Sign Up</Link>
							</li>
						</>
				}
			</ul>
		</header>
	);
};

export default Navbar;