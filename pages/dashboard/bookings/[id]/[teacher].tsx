import Card from "../../../../components/Card";
import SchoolLogo from "../../../../components/SchoolLogo";
import { useRouter } from "next/router";
import { IHour, IMeeting, ITeacher } from "../../../../database/models/meeting";
import { useEffect, useState } from "react";
import Loading from "../../../../components/Loading";

export default function Teacher() {
  const router = useRouter();
  const { id, teacher: teacherId } = router.query;

  const [hours, setHours] = useState<Array<IHour>>([]);
  const [teacher, setTeacher] = useState<ITeacher>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("admin-token")) {
      router.push("/dashboard/login");
    }
    (async () => {
      try {
        const res = await fetch(`/api/admin/meetings/${id}`, {
          headers: {
            authorization: `bearer ${sessionStorage.getItem("admin-token")}`,
          },
        });
        const meeting: IMeeting = (await res.json()).meeting;
        setHours(meeting.hours);
        setTeacher(
          meeting.teachers.find(
            (teacher: ITeacher) => (teacher._id as any as string) === teacherId
          )
        );
        setLoading(false);
      } catch (e) {
        if (e.status === 401) {
          sessionStorage.removeItem("admin-token");
          router.push("/dashboard/login");
        } else {
          console.error(e);
          alert("ERROR: Failed to load the bookings.");
        }
      }
    })();
  }, [router, id, teacherId]);

  const cancelBooking = (bookingId) => {
    if (!confirm("Czy na pewno chcesz usunąć to spotkanie?")) return;
    fetch(
      `/api/admin/meetings/${id}/teachers/${teacherId}/bookings/${bookingId}`,
      {
        method: "delete",
        headers: {
          authorization: `bearer ${sessionStorage.getItem("admin-token")}`,
          "content-type": "application/json",
        },
      }
    )
      .then(() => {
        alert("Usunięto zapis.");
        router.push(`/dashboard/bookings/${id}/${teacherId}`);
      })
      .catch((e) => {
        console.error(e);
        alert("ERROR: Failed to cancel the booking.");
      });
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="content">
        <SchoolLogo
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/dashboard/meeting/${id}`)}
        />
        <h1>{teacher?.teacherName}</h1>
        {hours.map((hour) => {
          const booking =
            teacher &&
            teacher.bookings.find((booking) => booking.hourId === hour._id);
          return (
            <>
              <Card key={hour.displayName}>
                <div
                  className={
                    booking
                      ? "card-content booking"
                      : "card-content booking-free"
                  }
                  onClick={() => (booking ? cancelBooking(booking._id) : {})}
                >
                  <div className="card-content-container">
                    <h3>
                      {booking?.userName
                        ? `${booking.userName} ${booking.className}`
                        : "Wolny termin"}
                    </h3>
                    <h3 className="hour">{hour.displayName}</h3>
                  </div>
                </div>
              </Card>
            </>
          );
        })}
      </div>
      <style jsx>{`
        @import "styles/index.scss";

        .card-content {
          width: 100%;
          height: 100%;
          text-align: left;
          min-height: 70px;
          color: $text;
          text-decoration: none;
          .card-content-container {
            width: 100%;
            min-height: 70px;
            display: flex;
            align-items: center;
          }
          h3 {
            font-size: 18px;
            margin: 0 10px;
            width: 60%;
            padding: 15px 0px;
          }
          h3.hour {
            text-align: right;
            width: 40%;
            padding: 0px;
          }
        }

        .booking {
          transition: 0.2s ease;
          cursor: pointer;
          &:hover {
            color: #ff6161;
          }
        }

        .booking-free {
          color: #c1c1c1;
        }
      `}</style>
    </>
  );
}
