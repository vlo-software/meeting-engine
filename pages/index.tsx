import SchoolLogo from "../components/SchoolLogo";

export default function Landing() {
  return (
    <>
      <div className="content">
        <SchoolLogo />
        <div className="center-text">
          <h2>Poproś nauczyciela o link z zaproszeniem na zebranie.</h2>
        </div>
      </div>
      <style jsx>{`
        @import "styles/index.less";

        .center-text {
          display: flex;
          height: 50%;
          justify-content: center;
          align-items: center;
          padding: 40px;
          @media (max-width: 700px) {
            align-items: flex-start;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}
