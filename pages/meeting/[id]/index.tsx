import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import SchoolLogo from "../../../components/SchoolLogo";

async function getMeeting(id) {
  try {
    const rawReq = await fetch(`/api/meetings/${id}`);
    const { meeting } = await rawReq.json();
    return {
      meeting: meeting,
      error: null,
    };
  } catch (error) {
    return {
      meeting: null,
      error: error.message,
    };
  }
}

export default function Meeting() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<any>(null);

  useEffect(() => {
    if (id === undefined) {
      setError("No meeting id provided");
      setLoading(false);
      return;
    }
    getMeeting(id).then((data) => {
      setMeeting(data.meeting);
      setError(data.error);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="content">
        <SchoolLogo />
        {error || !meeting ? (
          <h1>Ten link jest niepoprawny lub może być uszkodzony!</h1>
        ) : (
          <>
            <h1>Wybierz nauczyciela</h1>
            {meeting.teachers.map((teacher) => (
              <Card key={teacher.teacherName}>
                <Link
                  href={`/meeting/${id}/teacher/${teacher.id}/bookings`}
                  passHref
                >
                  <div className="card-content">
                    <h3>{teacher.teacherName}</h3>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </Link>
              </Card>
            ))}
          </>
        )}
      </div>
      <style jsx>
        {`
          @import "styles/index.scss";

          @media (max-width: 768px) {
            h1 {
              font-size: 30px;
            }
          }

          h2 {
            font-weight: 700;
            font-size: 20px;
            color: $secondary;
          }

          .card-content {
            display: grid;
            width: 100%;
            height: 100%;
            grid-template-columns: 1fr 24px;
            text-align: left;
            height: 70px;
            line-height: 70px;
            color: $text;
            text-decoration: none;
            h3 {
              font-size: 18px;
              margin: 0 10px;
            }
            .bi-chevron-right {
              color: $text;
              -webkit-text-stroke: 2px $text;
              font-size: 18px;
            }
            &:hover {
              cursor: pointer;
            }
          }
        `}
      </style>
    </>
  );
}
