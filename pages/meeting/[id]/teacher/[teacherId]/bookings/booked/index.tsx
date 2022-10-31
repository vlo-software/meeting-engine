import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SchoolLogo from "../../../../../../../components/SchoolLogo";
import { BiCheckCircle } from "react-icons/bi";
import Loading from "../../../../../../../components/Loading";

async function getTeacher(id, teacherId) {
  const { meeting } = await fetch(`/api/meetings/${id}`).then((res) =>
    res.json()
  );
  return meeting.teachers.find((teacher) => teacher.id === teacherId);
}

async function cancelMeeting(id, teacherId, succsessCallback) {
  if (!confirm("Czy na pewno chcesz anulować to spotkanie?")) return;
  try {
    await fetch(`/api/meetings/${id}/teachers/${teacherId}`, {
      method: "DELETE",
    });
    succsessCallback();
  } catch (error) {
    console.error(error);
    alert(`Wystąpił błąd, kod: CB`);
    alert(
      "Nie udało się odwołać spotkania.\nSpróbuj ponownie lub skontaktuj się z administratorem."
    );
  }
}

export default function BookedBooking() {
  const router = useRouter();
  const { id, teacherId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/meetings/${id}/teachers/${teacherId}/booking`)
      .then((res) => res.json())
      .then((data) => {
        getTeacher(id, teacherId).then((teacher) => {
          setBooking(data.booking);
          setTeacher(teacher);
          setLoading(false);
        });
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, teacherId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="content">
        <SchoolLogo
          style={{
            cursor: "pointer",
          }}
          onClick={() => router.push(`/meeting/${id}`)}
        />
        {error ? (
          <h1>Ten link jest niepoprawny lub może być uszkodzony!</h1>
        ) : booking.status === "pending" ? (
          <>
            <h1>{teacher.teacherName}</h1>
            <h3>
              Twoje spotkanie zostało zarezerwowane na {booking.hour}{" "}
              {booking.hourDisplayName.split(" - ")[0]}
              {booking.date}
            </h3>
            <h3>
              Aby potwierdzić, kliknij link wysłany na podany przez ciebie adres
              e-mail.
            </h3>
            <div className="buttons">
              <button
                onClick={() => router.push(`/meeting/${id}`)}
                className="btn-back"
              >
                Wróć do listy nauczycieli
              </button>
              <button
                onClick={() =>
                  cancelMeeting(id, teacherId, () => {
                    router.push(`/meeting/${id}`);
                  })
                }
                className="btn-cancel"
              >
                Odwołaj spotkanie
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="teacher-name">{teacher.teacherName}</h1>
            <BiCheckCircle fontSize={80} color="#3EDB73" />
            <h3>
              Spotkanie umówione na {booking.hourDisplayName.split(" - ")[0]}
            </h3>
            <div className="buttons">
              <button
                onClick={() => router.push(`/meeting/${id}`)}
                className="btn-back"
              >
                Wróć do listy nauczycieli
              </button>
              <button
                onClick={() =>
                  cancelMeeting(id, teacherId, () => {
                    router.push(`/meeting/${id}`);
                  })
                }
                className="btn-cancel"
              >
                Odwołaj spotkanie
              </button>
            </div>
          </>
        )}
      </div>
      <style jsx>
        {`
          @import "styles/index.scss";

          h1.teacher-name {
            @media (max-width: 768px) {
              font-size: 1.5rem;
            }
          }

          .btn-back,
          .btn-cancel {
            height: 60px;
          }

          .btn-cancel {
            background-color: #ff5252;
            color: #fff;
          }

          .buttons {
            @media (max-width: 768px) {
              margin: 10px 0px;
              .btn-back,
              .btn-cancel {
                height: 50px;
                font-size: 1rem;
              }
            }
            margin: 60px 0px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}
      </style>
    </>
  );
}
