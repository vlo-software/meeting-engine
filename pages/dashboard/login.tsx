import Card from '../../components/Card';
import SchoolLogo from '../../components/SchoolLogo';
import Link from 'next/link';

export default function Login() {
	return (<>
		  <div className="content">
				<Link passHref href="/dashboard">
					<SchoolLogo />
				</Link>
				<h1>Zaloguj się</h1>
				<div className="login-card">
				<Card>
					<input type="text" placeholder="Login" />
					<input type="password" placeholder="Hasło" />
					<button onClick={() => {}}>Zaloguj się</button>
				</Card>
				</div>
			</div>
			<style jsx>{`
				@import "styles/index.less";

				.login-card {
					input[type="text"],
					input[type="password"] {
						width: calc(100% - 80px);
						margin: 10px 20px;
						max-width: 400px;
					}
					input[type="text"] {
						margin-top: 30px;
					}
					button {
						margin-bottom: 30px;
					}
				}
			`}
			</style>
	</>);
}