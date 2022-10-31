import { useEffect, useState } from "react";
import { IMeeting } from "../../database/models/meeting";
import SchoolLogo from "../../components/SchoolLogo";
import Meeting from "../../components/Meeting";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

export default function Home() {
  const [meetings, setMeetings] = useState<Array<IMeeting>>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (!sessionStorage.getItem("admin-token")) {
      router.push("/dashboard/login");
    }
    fetch("/api/admin/meetings", {
      headers: {
        authorization: `bearer ${sessionStorage.getItem("admin-token")}`,
      },
    })
      .then((res) => res.json())
      .then(setMeetings)
      .then(() => setLoading(false))
      .catch(() => {
        sessionStorage.removeItem("admin-token");
        router.push("/dashboard/login");
      });
  }, [router]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="content">
        <SchoolLogo />
        <h1>Witaj z powrotem</h1>
        <h2>Aktualne zebrania</h2>
        {meetings.map((meeting) => (
          <Meeting
            key={meeting._id}
            id={meeting._id}
            startsAt={meeting.startsAt}
          />
        ))}
        <button onClick={() => router.push("/dashboard/new")}>
          Dodaj zebranie
        </button>
      </div>
      <style jsx>
        {`
          @import "styles/index.scss";

          h2 {
            font-weight: 700;
            font-size: 20px;
            color: $secondary;
          }

          .content {
            overflow-y: scroll;
          }
        `}
      </style>
    </>
  );
}
