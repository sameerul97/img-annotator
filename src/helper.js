function getApiDomain() {
  const url = window.location.href.split("/")[2];
  if (url === "planetradio.co.uk" || url === "creative.bauermedia.co.uk") {
    return "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v4/api";
  } else if (url === "demomatthobbsnet.eu-west-2.elasticbeanstalk.com") {
    return "http://demomatthobbsnet.eu-west-2.elasticbeanstalk.com/img-annotator-master/server/api";
  } else {
    // return "http://localhost/api";
    return "http://localhost:8888/Project_2021/image-annotator/server/api";
  }
}

export const API_DOMAIN = getApiDomain();
