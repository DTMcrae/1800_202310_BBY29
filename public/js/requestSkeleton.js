export function loadSkeleton() {
  const doms = document.getElementsByClassName("requestPlaceholder");
  if ([...doms]?.length > 0) {
    $(".requestPlaceholder").load("/html/templates/requestTemplate.html");
    // console.log("skeleton is loaded");
  }
}
