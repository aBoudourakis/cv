import type {CSSProperties} from 'react';
import styles from './InfoIconTooltip.module.scss';
import {InfoIcon } from "src/components/core/Icons/Icons.tsx";

interface IInfoIconProps {
	tooltipText?: string;
	className?: string;
	style?: CSSProperties;
}

export default function InfoIconTooltip({
	                                 tooltipText,
	                                 className,
	                                 style = {}
                                 }: IInfoIconProps) {

	/** RENDER **/
	return (
		tooltipText && tooltipText?.length > 0 ? (
			<div
				className={`${styles.InfoIcon}${className ? ` ${className}` : ''}`} title={tooltipText}
				style={style}
			>
				<InfoIcon />
			</div>
		) : (
			<InfoIcon />
		)
	)
		;
}