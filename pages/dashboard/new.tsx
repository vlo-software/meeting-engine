import Card from '../../components/Card';
import SchoolLogo from '../../components/SchoolLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ConfigTeacherDTO } from '../../server/models/dto/teacher';

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/teachers'); // TODO: change to real url
  const teachers = await res.json();

  return {
    props: {
      teachers,
    },
  }
}

export default function New(props) {
	const router = useRouter();

	useEffect(() => {
		if (!sessionStorage.getItem('admin-token')) {
			router.push('/dashboard/login');
		}
	}, []);

	const [teachers, setTeachers] = useState<Array<ConfigTeacherDTO & { active: boolean }>>(props.teachers.map((teacher) => ({...teacher, active: true})));

	const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
	const [start, setStart] = useState(new Date().toISOString().substring(11, 16));
	const [end, setEnd] = useState(new Date().toISOString().substring(11, 16));

	const addMeeting = async () => {
		const [startHours, startMinutes] = start
			.split(":")
			.map((e) => parseInt(e));
		const [endHours, endMinutes] = end.split(":").map((e) => parseInt(e));
		const startsAt = new Date(date);
		const endsAt = new Date(date);

		startsAt.setHours(startHours, startMinutes);
		endsAt.setHours(endHours, endMinutes);

		await fetch("/api/admin/meetings", {
			method: "post",
			headers: {
				authorization:
					`bearer ${sessionStorage.getItem("admin-token")}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				startsAt: startsAt.getTime(),
				endsAt: endsAt.getTime(),
				teacherIds: teachers
					.filter((teacher) => teacher.active)
					.map((teacher) => teacher.id),
			}),
		});

		router.push("/dashboard");
	};
	return (<>
	 <div className="content">
    <Link href="/dashboard" passHref>
      <SchoolLogo />
    </Link>
    <h1>Stwórz zebranie</h1>
    <Card>
      <div className="card-content">
        <h3>Data zebrania</h3>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <h3>Godzina</h3>
        <div>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)}/>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)}/>
        </div>
        <h3>Nauczyciele</h3>
        <div className="teachers">
						{teachers.map((teacher, idx) => <div className="teacher" key={teacher.name}>
							<p>{teacher.name}</p>
      	      <input type="checkbox" checked={teacher.active} onChange={(e) => {
								const newTeachers = [...teachers];
								newTeachers[idx] = {...teachers[idx], active: e.target.checked};
								setTeachers(newTeachers);
							}}/>
						</div>)}
        </div>
      </div>
    </Card>
    <button onClick={addMeeting}>Dodaj</button>
  </div>
	<style jsx>{`
			@import "styles/index.less";

			input[type="time"] {
				width: calc(50% - 28px);
				&:first-child {
					margin-right: 4px;
				}
				&:last-child {
					margin-left: 4px;
				}
			}

			.teachers {
				margin-top: -10px;
				max-height: 190px;
				overflow-x: hidden;
				overflow-y: auto;
			}

			.teacher {
				display: grid;
				grid-template-columns: 1fr 30px;
				border: solid 2px #e8e8e8;
				background: #e8e8e8;
				border-radius: 10px;
				padding: 10px;
				height: 30px;
				font-family: "Poppins", sans-serif;
				font-weight: 700;
				color: @text;
				line-height: 30px;
				margin: 10px 0;
				&:first-child {
					margin-top: 4px;
				}
				&:last-child {
					margin-bottom: 4px;
				}
				p {
					margin: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					max-width: 270px;
				}
			}

			.card-content {
				margin: 0 20px 1.6em 20px;
				text-align: left;
			}
		`}
	</style>
	</>);
}