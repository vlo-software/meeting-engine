import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../../../../../../components/Card";
import Loading from "../../../../../../components/Loading";
import SchoolLogo from "../../../../../../components/SchoolLogo";

async function getHours(id, teacherId) {
  try {
    const rawReq = await fetch(
      `/api/meetings/${id}/teachers/${teacherId}/hours`
    );
    const data = await rawReq.json();
    return {
      hours: data.hours.filter((h) => {
        const start = h.displayName.split(" - ")[0];
        const startDate = new Date();
        startDate.setHours(parseInt(start.split(":")[0]));
        startDate.setMinutes(parseInt(start.split(":")[1]));
        return startDate > new Date();
      }),
      error: null,
    };
  } catch (error) {
    return {
      hours: null,
      error: error.message,
    };
  }
}

async function getBooking(id, teacherId) {
  try {
    const rawReq = await fetch(
      `/api/meetings/${id}/teachers/${teacherId}/booking`
    );
    const data = await rawReq.json();
    return {
      booking: data.booking,
      error: null,
    };
  } catch (error) {
    return {
      booking: null,
      error: error.message,
    };
  }
}

export default function Bookings() {
  const router = useRouter();
  const { id, teacherId } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hours, setHours] = useState<any>(null);

  useEffect(() => {
    if (id === undefined || teacherId === undefined) {
      setError("Invalid meeting or teacher");
      setLoading(false);
      return;
    }
    getHours(id, teacherId).then((data) => {
      setHours(data.hours);
      setError(data.error);
      if (data.error) {
        getBooking(id, teacherId)
          .then((data) => {
            if (data.booking) {
              router.push(
                `/meeting/${id}/teacher/${teacherId}/bookings/booked`
              );
            } else {
              setLoading(false);
            }
          })
          .catch((_) => {});
      } else {
        setLoading(false);
      }
    });
  }, [id, router, teacherId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="content">
        <SchoolLogo
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/meeting/${id}`)}
        />
        {error ? (
          <h1>Ten link jest niepoprawny lub może być uszkodzony!</h1>
        ) : (
          <>
            <h1>Wybierz godzinę</h1>
            <div className="cards">
              {hours.map((hour) => (
                <Card key={hour.displayName}>
                  <Link
                    href={`/meeting/${id}/teacher/${teacherId}/bookings/${hour.id}`}
                    passHref
                  >
                    <div className="card-content">
                      <h3 className="hour">{hour.displayName}</h3>
                      <i className="bi bi-chevron-right"></i>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <style jsx>
        {`
          @import "styles/index.less";

          .cards {
            margin-bottom: 60px;
          }

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
            cursor: pointer;
            .bi-chevron-right {
              margin: 0 10px;
              color: @text;
              -webkit-text-stroke: 2px @text;
              font-size: 18px;
              text-align: right;
            }
            h3 {
              font-size: 18px;
              margin: 0 10px;
            }
            h3.hour {
              text-align: left;
            }
          }
        `}
      </style>
    </>
  );
}
