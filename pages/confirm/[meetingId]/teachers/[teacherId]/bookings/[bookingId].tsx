import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../../../../../../components/Loading";
import SchoolLogo from "../../../../../../components/SchoolLogo";

export default function CancelBooking() {
  const router = useRouter();
  const { meetingId, teacherId, bookingId } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmBooking = async () => {
      const response = await fetch(
        `/api/meetings/${meetingId}/teachers/${teacherId}/bookings/${bookingId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setLoading(false);
      }
    };
    if (meetingId && teacherId && bookingId) {
      confirmBooking();
    }
  }, [meetingId, teacherId, bookingId]);

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
        {loading ? (
          <Loading />
        ) : (
          <h1 style={{ padding: "15px" }}>Spotkanie zostało potwierdzone</h1>
        )}
      </div>
    </>
  );
}
