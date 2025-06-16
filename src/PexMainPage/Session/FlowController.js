import { useSession } from "./useSession";
import Login from "./Login";
import RoomAllocation from "./RoomAllocation";
import EquipmentRegistration from "./EquipmentRegistration";
import ChecklistValidation from "./ChecklistValidation";
import SUManagement from "./SUManagement";
import Packaging from "./Packaging";
import Reconciliation from "./Reconciliation";
import Cleanroom from "./Cleanroom";

const FlowController = () => {
  const { session } = useSession();

  switch (session.currentStep) {
    case "login":
      return <Login />;
    case "roomAllocation":
      return <RoomAllocation />;
    case "equipment":
      return <EquipmentRegistration />;
    case "checklist":
      return <ChecklistValidation />;
    case "suManagement":
      return <SUManagement />;
    case "packaging":
      return <Packaging />;
    case "reconciliation":
      return <Reconciliation />;
    case "cleanroom":
      return <Cleanroom />;
    default:
      return <Login />;
  }
};

export default FlowController;
