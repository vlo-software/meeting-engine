import { useEffect, useState } from "react"
import { IMeeting } from "../../database/models/meeting";
import Link from 'next/link';
import SchoolLogo from '../../components/SchoolLogo';
import Meeting from '../../components/Meeting';
import { useRouter } from "next/router";

export default function Home() {
  const [meetings, setMeetings] = useState<Array<IMeeting>>([]);
  const router = useRouter();
  useEffect(() => {
    if (!sessionStorage.getItem("admin-token")) {
      router.push("/dashboard/login");
    }
    fetch("/api/admin/meetings", {
      headers: {
        authorization:
          `bearer ${sessionStorage.getItem("admin-token")}`,
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
