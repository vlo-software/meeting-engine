import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../../../../../../components/Loading";
import SchoolLogo from "../../../../../../components/SchoolLogo";

export default function CancelBooking() {
  const router = useRouter();
  const { meetingId, teacherId, bookerToken } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deleteBooking = async () => {
      const response = await fetch(
        `/api/meetings/${meetingId}/teachers/${teacherId}/booker/${bookerToken}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setLoading(false);
      }
    };
    if (meetingId && teacherId && bookerToken) {
      deleteBooking();
    }
  }, [meetingId, teacherId, bookerToken]);

  return (
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
        {loading ? <Loading /> : <h1>Spotkanie zostało odwołane</h1>}
      </div>
    </>
  );
}
