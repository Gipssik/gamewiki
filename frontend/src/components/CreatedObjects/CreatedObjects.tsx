import React, {FC} from 'react';
import styles from "./CreatedObjects.module.css"
import {Sale} from "../../client";
import {Collapse, Divider} from "antd";
import {BlockElement} from "../BlockElement";

export type Block = {
	title: string,
	getObjectTitle: (obj: any) => string,
}

const getTitle = (obj: any): string => {
	if (obj.hasOwnProperty('title'))
		return obj["title"] as string
	return ""
}

const getSaleString = (obj: Sale): string => `Game: "${obj.game.title}" | Platform: "${obj.platform.title}"`

const blocks: Block[] = [
	{title: 'created_companies', getObjectTitle: getTitle},
	{title: 'created_platforms', getObjectTitle: getTitle},
	{title: 'created_games', getObjectTitle: getTitle},
	{title: 'created_genres', getObjectTitle: getTitle},
	{title: 'created_sales', getObjectTitle: getSaleString},
	{title: 'created_backups', getObjectTitle: getTitle},
]

export const CreatedObjects: FC = () => {
	return (
		<div className={styles.container}>
			<h2>Created objects</h2>
			<Divider style={{padding: 0}}/>
			<Collapse>
				{
					blocks.map(block => {
						return (
							<Collapse.Panel
								key={block.title}
								header={
									block.title.split("_")
										.map(s => s.toUpperCase())
										.join(" ")
								}
							>
								<BlockElement block={block}/>
							</Collapse.Panel>
						)
					})
				}
			</Collapse>
		</div>
	);
};
