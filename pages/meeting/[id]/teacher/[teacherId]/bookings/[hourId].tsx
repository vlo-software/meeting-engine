import { useRouter } from "next/router";
import { useState } from "react";
import Card from "../../../../../../components/Card";
import SchoolLogo from "../../../../../../components/SchoolLogo";
import { readFileSync } from "fs";
import { resolve } from "path";

export async function getServerSideProps(context) {
  const { id, teacherId, hourId } = context.params;
  try {
    const { meeting } = await fetch(
      // TODO: get this to work in production
      `http://localhost:3000/api/meetings/${id}`
    ).then((res) => res.json());

    const classes = JSON.parse(
      readFileSync(resolve(process.cwd(), "config/classes.json"), {
        encoding: "utf8",
      })
    );

    return {
      props: {
        id,
        teacherId,
        teacher: meeting.teachers.find((teacher) => teacher.id === teacherId),
        hour: meeting.hours.find((hour) => hour.id === hourId),
        classes,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        id,
        teacherId,
        teacher: null,
        hour: null,
        classes: [],
        error: error.message,
      },
    };
  }
}

export default function AddBooking({ id, teacherId, teacher, hour, classes }) {
  const router = useRouter();

  const formattedHour = hour.displayName.split(" ")[0];

  const [parentName, setParentName] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");

  async function bookMeeting() {
    if (parentName.length === 0) {
      alert("Please enter the student's name first.");
      return;
    }
    if (className.length === 0) {
      alert("Please select a class first.");
    }
    if (email.length === 0) {
      alert("Please enter the email address first.");
      return;
    }
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      alert("Please enter a valid email address.");
      return;
    }
    const rawReq = await fetch(
      `/api/meetings/${id}/teachers/${teacherId}/hours/${hour.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: parentName,
          classname: className,
          email,
        }),
      }
    );
    if (rawReq.status === 400) {
      alert("ERROR: The hour might already be booked.\nPlease try again.");
      router.push(`/meeting/${id}/teacher/${teacherId}/bookings`);
    } else {
      router.push(`/meeting/${id}/teacher/${teacherId}/bookings/booked`);
    }
  }

  return (
    <>
      <div className="content">
        <SchoolLogo
          style={{ cursor: "pointer" }}
          onClick={() =>
            router.push(`/meeting/${id}/teacher/${teacherId}/bookings`)
          }
        />
        <h1>Umów spotkanie</h1>
        <Card>
          <div className="info-box">
            <div className="title">Nauczyciel</div>
            <div className="data">{teacher.teacherName}</div>
          </div>
          <div className="info-box">
            <div className="title">Godzina</div>
            <div className="data">{formattedHour}</div>
          </div>
          <div className="input-box">
            <div className="title">Imię i nazwisko ucznia</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                bookMeeting();
              }}
            >
              <input
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                type="text"
              />
              <div className="title">Klasa ucznia</div>
              <select
                onChange={(e) => setClassName(e.target.value)}
                name="class"
                id="class"
              >
                <option value="" selected disabled hidden>
                  Wybierz klasę
                </option>
                {classes.map((className: string) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              <div className="title">Adres email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </form>
          </div>
          <button className="book-meeting" onClick={bookMeeting}>
            Zarezerwuj termin
          </button>
        </Card>
      </div>
      <style jsx>{`
        @import "styles/index.less";

        div.info-box {
          margin: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          padding: 10px 0px;
          div.title,
          div.data {
            width: 50%;
            text-align: left;
          }
          div.title {
            font-weight: bold;
          }
          div.data {
            font-weight: normal;
          }
        }

        div.input-box {
          margin: 20px 20px;
          div.title {
            font-weight: bold;
            font-size: 20px;
            text-align: left;
          }
          input {
            margin-top: 20px;
            margin-bottom: 20px;
            width: 100%;
            height: 60px;
            font-size: 14px;
            font-weight: bold;
            padding: 20px;
            box-sizing: border-box;
            background: @background-secondary;
            border: none;
            border-radius: 10px;
          }
        }

        button.book-meeting {
          width: calc(100% - 40px);
          height: 60px;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        #class {
          width: 100%;
          height: 40px;
          border: none;
          border-radius: 10px;
          background: @background-secondary;
          box-sizing: border-box;
          text-align: center;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
