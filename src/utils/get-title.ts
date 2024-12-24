const TITLE_TEMPLATE = "%s | Car Finance Calculator";

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title);
}
