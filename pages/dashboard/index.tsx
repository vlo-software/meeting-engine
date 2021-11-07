import { useEffect, useState } from "react"
import { IMeeting } from "../../database/models/meeting";
import Link from 'next/link';
import SchoolLogo from '../../components/SchoolLogo';
import Meeting from '../../components/Meeting';

export default function Home() {
  const [meetings, setMeetings] = useState<Array<IMeeting>>([]);
  useEffect(() => {
    fetch("/api/admin/meetings", {
      headers: {
        authorization:
          "adf eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjM2MjQzODY2LCJleHAiOjE2MzY0MTY2NjZ9.DDXwuun-RfJOdt22Q5h9skljWL_WeN2vDclxUyefMZg",
      },
    }).then((res) => res.json()).then(setMeetings);
  }, [])
  return (
    <>
      <div className="content">
        <Link href="/dashboard" passHref>
          <SchoolLogo/>
        </Link>
        <h1>Witaj z powrotem</h1>
        <h2>Aktualne zebrania</h2>
        {meetings.map((meeting) => 
          <Meeting key={meeting._id} id={meeting._id} startsAt={meeting.startsAt} />
        )}
        <Link href="/dashboard/new" passHref>
          <button>Dodaj zebranie</button>
        </Link>
      </div>
      <style jsx>{`
      @import "styles/index.less";

      h2 {
        font-weight: 700;
        font-size: 20px;
        color: @secondary;
      }

      .content {
        // TODO: fix later
        padding-left: 14px;
        overflow-y: scroll;
      }
        `}
      </style>
      </>
  )
}
