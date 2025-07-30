import { Outlet } from "react-router-dom";
import DrawerComponent from "../../components/drawer";
import UseDirection from "../../hooks/use-direction";

function AdminPanel() {
  const drawerWidth = "w-60"; // You can make this dynamic or pass as prop
  const { direction } = UseDirection();
  return (
    <div className="flex min-h-screen">
      <DrawerComponent width={drawerWidth} side={direction.left} />
      <main className={`flex-1 ${drawerWidth === "w-80" ? "ml-80" : "ml-60"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPanel;
