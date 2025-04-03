import { LoggedLayout } from "../layout/layoutLogged";

const DashboardPage = () => {
    return (
        <LoggedLayout>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard!</p>
            </div>
        </LoggedLayout>
    );
};
export default DashboardPage;