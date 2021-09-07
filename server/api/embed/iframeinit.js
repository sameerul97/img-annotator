var iframes = document.querySelectorAll(".img_annotator_iframe");

iframes.forEach((i) => {
  iFrameResize(
    {
      log: false 
    },
    "#" + i.getAttribute("id")
  );
});
