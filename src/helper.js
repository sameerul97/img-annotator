function getApiDomain() {
  const url = window.location.href.split("/")[2];
  if (url === "planetradio.co.uk" || url === "creative.bauermedia.co.uk") {
    return "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/api";
  } else if (url === "demomatthobbsnet.eu-west-2.elasticbeanstalk.com") {
    return "http://demomatthobbsnet.eu-west-2.elasticbeanstalk.com/img-annotator-master/server/api";
  } else {
    return "http://localhost/api";
    // return "http://localhost:8888/Project_2021/image-annotator/server/api";
  }
}

function getAppDomain() {
  const url = window.location.href.split("/")[2];
  if (url === "planetradio.co.uk" || url === "creative.bauermedia.co.uk") {
    return "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5";
  } else if (url === "demomatthobbsnet.eu-west-2.elasticbeanstalk.com") {
    return "http://demomatthobbsnet.eu-west-2.elasticbeanstalk.com/img-annotator-master";
  } else {
    return `http://${url}/#`;
  }
}

function getServerAppDomain() {
  const url = window.location.href.split("/")[2];
  if (url === "planetradio.co.uk" || url === "creative.bauermedia.co.uk") {
    return "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/api";
  } else {
    return "http://localhost/api";
  }
}

export const API_DOMAIN = getApiDomain();
export const APP_DOMAIN = getAppDomain();
export const SERVER_APP_DOMAIN = getServerAppDomain();
