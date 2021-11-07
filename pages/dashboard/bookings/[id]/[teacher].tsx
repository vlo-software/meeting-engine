import Card from '../../../../components/Card';
import SchoolLogo from '../../../../components/SchoolLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IHour, IMeeting, ITeacher } from "../../../../database/models/meeting";
import { useEffect, useState } from 'react';

export default function Teacher() {
	const router = useRouter();
	const { id, teacher: teacherId } = router.query;
	console.log(router.query);

	const [hours, setHours] = useState<Array<IHour>>([]);
	const [teacher, setTeacher] = useState<ITeacher>();

	useEffect(() => {
		(async () => {
			const res = await fetch(
				`http://localhost:3000/api/admin/meetings/${id}`,
				{
					headers: {
						authorization:
							"adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
					},
				}
			);
			const meeting: IMeeting = (await res.json()).meeting;
			setHours(meeting.hours);
			setTeacher(meeting.teachers.filter(
				(teacher: ITeacher) =>
					(teacher._id as any as string) === teacherId
			)[0]);
		})();
	}, [])

	return (<>
		  <div className="content">
				<Link passHref href="/dashboard">
					<SchoolLogo/>
				</Link>
				<h1>{ teacher?.teacherName }</h1>
				{hours.map((hour) => {
				const booking = teacher && teacher.bookings.find((booking) => booking.hourId === hour._id);
				return <>
					<Card key={hour.displayName}>
							<div className={booking ? 'card-content' : 'card-content booking-free'}>
								<h3>{ booking?.userName || "Wolny termin" }</h3>
								<h3 className="hour">{ hour.displayName }</h3>
							</div>
					</Card>
				</>})}
			</div>
			<style jsx>{`
				@import "styles/index.less";

				.card-content {
					display: grid;
					width: 100%;
					height: 100%;
					grid-template-columns: auto auto;
					text-align: left;
					height: 70px;
					line-height: 70px;
					color: @text;
					text-decoration: none;
					h3 {
						font-size: 18px;
						margin: 0 10px;
					}
					h3.hour {
						text-align: right;
					}
				}

				.booking-free {
					color: #c1c1c1;
				}
			`}</style>
	</>);
}