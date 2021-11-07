import Card from "./Card";
import Link from 'next/link';

const months = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

export default function Meeting(props) {
	const { id, startsAt }: { id: number, startsAt: number } = props;
	const start = new Date(startsAt);
	const date = `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
	return (<>
		<Card>
				<Link href={`/dashboard/meeting/${id}`} passHref>
					<div className="card-content">
							<i className="bi bi-calendar4-event"></i>
								<h1>{date}</h1>
							<i className="bi bi-chevron-right"></i>
					</div>
				</Link>
		</Card>
		<style jsx>{`
			@import "styles/colors.less";

			h1 {
				color: @text;
				margin: 0;
				font-size: 24px;
				font-weight: 700;
				line-height: 100px;
			}

			.card-content {
				width: 100%;
				height: 100%;
				display: grid;
				grid-template-columns: auto 1fr 34px;
				text-align: left;
				line-height: 100px;
				color: @text;
				text-decoration: none;
				.bi-calendar4-event {
					padding-left: 15px;
					padding-right: 15px;
					-webkit-text-stroke: 1px @text;
					font-size: 24px;
				}
				.bi-chevron-right {
					-webkit-text-stroke: 2px @text;
					font-size: 24px;
				}
				&:hover {
					cursor: pointer;
				}
			}
		`}
		</style>
	</>);
}