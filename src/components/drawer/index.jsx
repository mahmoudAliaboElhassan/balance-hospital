import { useState } from "react";
import UseDirection from "../../hooks/use-direction";
import TabsViewFancy from "../tabs";

function DrawerComponent({ width = "w-60" }) {
  const { direction } = UseDirection();

  return (
    <div
      className={`fixed top-0 ${
        direction.left === "left" ? "left-0" : "right-0"
      } h-full ${width} bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-lg z-40`}
    >
      <div className="p-4 h-full overflow-auto flex items-center justify-center">
        <TabsViewFancy />
      </div>
    </div>
  );
}
export default DrawerComponent;
