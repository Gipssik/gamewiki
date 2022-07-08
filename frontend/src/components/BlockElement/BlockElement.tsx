import {Empty, List} from 'antd';
import React from 'react';
import {type Block} from "../CreatedObjects"
import {useAppSelector} from "../../store";
import {Link} from "react-router-dom";
import styles from "./BlockElement.module.css"

type BlockElementProps = {
	block: Block
}

const BlockElement: React.FC<BlockElementProps> = ({block}) => {
	const me = useAppSelector(s => s.auth.me)
	// @ts-ignore
	const arrayOfObj: Object[] | null = me[block.title] || null

	return (
		<List>
			{
				arrayOfObj && arrayOfObj.length > 0
				?
				arrayOfObj.map(obj =>
					<List.Item key={block.getObjectTitle(obj)}>
						{/*@ts-ignore*/}
						<Link className={styles.link} to={`/${block.title.split('_')[1]}/${obj.id}`}>
							<div>{block.getObjectTitle(obj)}</div>
						</Link>
					</List.Item>
				)
				:
				<Empty description="No objects"/>
			}
		</List>
	);
};

export default BlockElement;