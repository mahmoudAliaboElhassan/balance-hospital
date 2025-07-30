function UseDirection() {
  const dir = document.documentElement.dir || "ltr";
  console.log("dir", dir);
  const left = dir === "ltr" ? "left" : "right";
  const right = dir === "ltr" ? "right" : "left";

  const direction = {
    direction: dir,
    left: left,
    right: right,
    marginLeft: `margin-${left}`,
    marginRight: `margin-${right}`,
    paddingLeft: `padding-${left}`,
    paddingRight: `padding-${right}`,
    borderTopRightRadius: `border-top-${right}-radius`,
    borderRight: `border-${right}`,
  };
  return { direction };
}

export default UseDirection;
