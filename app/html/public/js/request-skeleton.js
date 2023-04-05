export function loadSkeleton() {
  const doms = document.getElementsByClassName("requestPlaceholder");
  if ([...doms]?.length > 0) {
    $(".requestPlaceholder").load("./app/html/templates/request-template.html");
    // console.log("skeleton is loaded");
  }
}
