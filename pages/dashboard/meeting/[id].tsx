import Card from '../../../components/Card';
import SchoolLogo from '../../../components/SchoolLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ITeacher } from '../../../database/models/meeting';

export default function Meeting() {
	const router = useRouter();
	const { id } = router.query;

	const [teachers, setTeachers] = useState<Array<ITeacher>>([]);

	useEffect(() => {
		 fetch(
			`http://localhost:3000/api/admin/meetings/${id}`,
			{
				headers: {
					authorization:
						"adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
				},
			}
		).then(res => res.json()).then((data) => setTeachers(data.meeting.teachers));
	}, []);

	const remove = async () => {
		await fetch(`/api/admin/meetings/${id}`, {
			method: "delete",
			headers: {
				authorization:
					"adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
				"content-type": "application/json",
			},
		});
		router.push("/dashboard");
	};

	return (<>
			<div className="content">
			<Link passHref href="/dashboard">
				<SchoolLogo/>
			</Link>
			<h1>Wybierz naucznika</h1>
			{teachers.map((teacher) =>
				<Card key={teacher.teacherName}>
					<Link
						href={`/dashboard/bookings/${id}/${teacher._id}`}
						passHref
						>
						<div className="card-content">
						<h3>{ teacher.teacherName }</h3>
						<i className="bi bi-chevron-right"></i>
						</div>
					</Link>
				</Card>
			)}

			<button className="btn-red" onClick={remove}>Usuń zebranie</button>
		</div>
		<style jsx>{`
			@import "styles/index.less";

			.card-content {
				display: grid;
				width: 100%;
				height: 100%;
				grid-template-columns: 1fr 24px;
				text-align: left;
				height: 70px;
				line-height: 70px;
				color: @text;
				text-decoration: none;
				h3 {
					font-size: 18px;
					margin: 0 10px;
				}
				.bi-chevron-right {
					color: @text;
					-webkit-text-stroke: 2px @text;
					font-size: 18px;
				}
				&:hover {
					cursor: pointer;
				}
			}

			.btn-red {
				margin-top: 20px;
				color: white;
				background: #ff6161;
			}

			.content {
				// TODO: fix later
				padding-left: 14px;
				overflow-y: scroll;
			}
		`}
		</style>
		</>);
}