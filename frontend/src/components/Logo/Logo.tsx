import React from 'react';
import {Link} from "react-router-dom";
import styles from './Logo.module.css'

const Logo = () => {
	return (
		<Link to="/" className={styles.logo}>
			Game<span>Wiki</span>
		</Link>
	);
};

export default Logo;