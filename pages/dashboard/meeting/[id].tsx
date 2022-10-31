import Card from "../../../components/Card";
import SchoolLogo from "../../../components/SchoolLogo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ITeacher } from "../../../database/models/meeting";
import Loading from "../../../components/Loading";
import { utils as xlsxUtils, writeFile } from "xlsx";

function generateExcel(meeting) {
  const data = [];
  const hours = ["", ...meeting.hours.map((hour) => hour.displayName)];
  data.push(hours);
  meeting.teachers.forEach((teacher) => {
    const row = [teacher.teacherName];
    meeting.hours.forEach((hour) => {
      const booking = teacher.bookings.find(
        (booking) => booking.hourId === hour._id
      );
      row.push(booking ? booking.userName : "");
    });
    data.push(row);
  });
  const wb = xlsxUtils.book_new();
  const ws = xlsxUtils.aoa_to_sheet(data);

  // https://stackoverflow.com/questions/24395693/how-to-set-cell-width-when-export-xlsx-files-with-js-xlsx
  const fitToColumn = (arrayOfArray) => {
    // get maximum character of each column
    return arrayOfArray[0].map((a, i) => ({
      wch: Math.max(
        ...arrayOfArray.map((a2) => (a2[i] ? a2[i].toString().length : 0))
      ),
    }));
  };
  ws["!cols"] = fitToColumn(data);

  xlsxUtils.book_append_sheet(wb, ws, "Zebranie");
  writeFile(wb, "Zebranie.xlsx");
}

function generateLink(id) {
  const link = `${window.location.origin}/meeting/${id}`;
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link);
    alert("Link został skopiowany do schowka.");
  } else {
    alert(`Twoja przeglądarka nie obsługuje kopiowania do schowka.
    \nLink: ${link}`);
  }
}

export default function Meeting() {
  const router = useRouter();
  const { id } = router.query;

  const [teachers, setTeachers] = useState<Array<ITeacher>>([]);
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("admin-token")) {
      router.push("/dashboard/login");
    }
    fetch(`/api/admin/meetings/${id}`, {
      headers: {
        authorization: `bearer ${sessionStorage.getItem("admin-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data.meeting);
        setTeachers(data.meeting.teachers);
      })
      .then(() => setLoading(false))
      .catch((e) => {
        if (e.status === 401) {
          sessionStorage.removeItem("admin-token");
          router.push("/dashboard/login");
        } else {
          console.error(e);
          alert("ERROR: Failed to load the meeting.");
        }
      });
  }, [router, id]);

  const remove = async () => {
    if (!confirm("Czy na pewno chcesz usunąć to zebranie?")) return;
    try {
      await fetch(`/api/admin/meetings/${id}`, {
        method: "delete",
        headers: {
          authorization: `bearer ${sessionStorage.getItem("admin-token")}`,
          "content-type": "application/json",
        },
      });
      router.push("/dashboard");
    } catch (e) {
      if (e.status === 401) {
        sessionStorage.removeItem("admin-token");
        router.push("/dashboard/login");
      } else {
        console.error(e);
        alert("ERROR: Failed to delete the meeting.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="content">
        <SchoolLogo
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        />
        <h1>Wybierz nauczyciela</h1>
        {teachers.map((teacher) => (
          <Card key={teacher.teacherName}>
            <Link href={`/dashboard/bookings/${id}/${teacher._id}`} passHref>
              <div className="card-content">
                <h3>{teacher.teacherName}</h3>
                <i className="bi bi-chevron-right"></i>
              </div>
            </Link>
          </Card>
        ))}

        <div className="btn-container">
          <button onClick={() => generateExcel(meeting)}>
            Pobierz Excelka
          </button>
          <button onClick={() => generateLink(id)}>Wygeneruj link</button>
          <button className="btn-red" onClick={remove}>
            Usuń zebranie
          </button>
        </div>
      </div>
      <style jsx>
        {`
          @import "styles/index.scss";

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

          .btn-red {
            color: white;
            background: #ff6161;
          }

          .content {
            overflow-y: scroll;
          }

          .btn-container {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}
      </style>
    </>
  );
}
