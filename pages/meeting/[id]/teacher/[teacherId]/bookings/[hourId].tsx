import { useRouter } from "next/router";
import { useState } from "react";
import Card from "../../../../../../components/Card";
import SchoolLogo from "../../../../../../components/SchoolLogo";
import { readFileSync } from "fs";
import { resolve } from "path";
import Loading from "../../../../../../components/Loading";

export async function getServerSideProps(context) {
  const { id, teacherId, hourId } = context.params;
  try {
    const { meeting } = await fetch(
      `${process.env.URL}/api/meetings/${id}`
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
  const [loading, setLoading] = useState(false);

  async function bookMeeting() {
    if (parentName.length === 0) {
      alert("Proszę podać imię ucznia.");
      return;
    }
    if (className.length === 0) {
      alert("Proszę wybrać klasę.");
    }
    if (email.length === 0) {
      alert("Proszę wpisać adres e-mail.");
      return;
    }
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      alert("Proszę wpisać poprawny adres e-mail.");
      return;
    }
    setLoading(true);
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
      alert(`Wystąpił błąd, kod: AB\nTreść: ${await rawReq.text()}`);
      alert(
        "ERROR: AB\nCoś poszło nie tak.\nSpróbuj jeszcze raz.\nW razie dalszych problemów skontaktuj się z administratorem."
      );
      router.push(`/meeting/${id}/teacher/${teacherId}/bookings`);
    } else {
      router.push(`/meeting/${id}/teacher/${teacherId}/bookings/booked`);
    }
  }

  return loading ? (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "200px",
        }}
      >
        <SchoolLogo />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading />
      </div>
    </>
  ) : (
    <>
      <div className="content">
        <SchoolLogo
          style={{ cursor: "pointer" }}
          onClick={() =>
            router.push(`/meeting/${id}/teacher/${teacherId}/bookings`)
          }
        />
        <h1>Umów spotkanie</h1>
        <div className="main">
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
      </div>
      <style jsx>{`
        @import "styles/index.less";

        .main {
          margin-bottom: 50px;
        }

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
          color: black;
          box-sizing: border-box;
          text-align: center;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 20px;
          -webkit-appearance: none;
        }
      `}</style>
    </>
  );
}
