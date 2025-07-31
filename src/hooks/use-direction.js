import i18next from "i18next";

function useDirection() {
  const lang = i18next.language;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isLtr = dir == "ltr";

  const left = isLtr ? "left" : "right";
  const right = isLtr ? "right" : "left";
  const direction = {
    direction: dir,
    left,
    right,
    marginLeft: `margin-${left}`,
    marginRight: `margin-${right}`,
    paddingLeft: `padding-${left}`,
    paddingRight: `padding-${right}`,
    borderTopRightRadius: `border-top-${right}-radius`,
    borderRight: `border-${right}`,
  };
  return { direction };
}

export default useDirection;
