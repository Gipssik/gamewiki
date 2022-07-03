import React from 'react';
import styles from './PageNotFound.module.css'
import {Link, useNavigate} from "react-router-dom";

const PageNotFound = () => {
	const navigate = useNavigate();

	return (
		<div className={styles.error404}>
			<div className={styles.error404body}>
				<div className={styles.container}>
					<h1>Not found</h1>
					<p> Sorry, but the page you were trying to view does not exist.</p>
					<p> There Could be a lots of Reason Behind this </p>
					<ul>
						<li> You are a <code>All-time</code> Unlucky person, Thus. </li>
						<li> God Doesn't love you at all, Thus. </li>
						<li> Dooms day is here, Servers are Dyings, Thus. </li>
						<li> You killed a Kitten Recently, Thus. </li>
						<li> You Mistyped a <strong>URL</strong>, Thus. </li>
						<li> You Followed a <strong>OLD, DEAD, BROKEN</strong> url, Thus. </li>
						<li> Or you are just missing Windows Blue Screen, Thus. </li>
					</ul>
					<p>
						'nough Said, Now <span onClick={() => navigate(-1)} className={styles.link}>Go Back</span> // Or Return To <span onClick={() => navigate('/')} className={styles.link}>homepage</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default PageNotFound;