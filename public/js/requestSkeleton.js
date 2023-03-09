export function loadSkeleton(){
    const doms = document.getElementsByClassName("requestPlaceholder");
    if ([...doms]?.length > 0) {
        $('.requestPlaceholder').load('/html/requestTemplate.html');
        console.log("skeleton is loaded");
    }
}