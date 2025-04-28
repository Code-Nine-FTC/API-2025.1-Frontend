import RegisterStationForm from "../components/ui/RegisterStationForm";
import { LoggedLayout } from "../layout/layoutLogged";

export default function RegisterStationPage() {
    return (
        <LoggedLayout>
            <RegisterStationForm />
        </LoggedLayout>
    )
}