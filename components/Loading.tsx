export default function Loading() {
  return (
    <>
      <div className="loading-container">
        <div className="lds-dual-ring"></div>
      </div>
      <style jsx>{`
        @import "styles/index.less";

        .loading-container {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .lds-dual-ring {
          display: inline-block;
          width: 80px;
          height: 80px;
        }
        .lds-dual-ring:after {
          content: " ";
          display: block;
          width: 64px;
          height: 64px;
          margin: 8px;
          border-radius: 50%;
          border: 8px solid @important;
          border-color: @important transparent @important transparent;
          animation: lds-dual-ring 1.2s linear infinite;
        }
        @keyframes lds-dual-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
