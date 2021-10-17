import { Widget_ID } from "../components/Widgets";

async function ParseData(imageData: any) {
  const fetchedImage = {} as any,
    popupContent = [] as any;

  fetchedImage["url"] = imageData[0]["url"];
  fetchedImage["name"] = imageData[0]["name"];
  fetchedImage["id"] = imageData[0]["Image_Id"];
  fetchedImage["marker_positions"] = [];
  fetchedImage["header"] = imageData[0]["page_header"];
  fetchedImage["copy"] = imageData[0]["page_header"];
  fetchedImage["script"] = imageData[0]["page_script"];

  const temp_markers = [] as any;
  for (let i in imageData) {
    const thisMarkerid = parseInt(imageData[i].Marker_id);
    let markerFound = false;

    for (let j in temp_markers) {
      if (parseInt(temp_markers[j]) === thisMarkerid) {
        markerFound = true;
        break;
      }
    }

    if (!markerFound) {
      temp_markers.push(thisMarkerid);
    }
  }

  for (let i in temp_markers) {
    let thisMarkerid = parseInt(temp_markers[i]);

    for (let j in imageData) {
      if (parseInt(imageData[j].Marker_id) === thisMarkerid) {
        fetchedImage["marker_positions"][i] = {
          m_id: thisMarkerid,
          top: parseFloat(imageData[j].markerTop),
          left: parseFloat(imageData[j].markerLeft),
          color: imageData[j].color,
          animation_type: imageData[j].animation_type,
          marker_type: imageData[j].marker_type,
          marker_image: imageData[j].marker_image,
          background_color: imageData[j].background_color,
          border_radius: imageData[j].border_radius,
          popup_id: thisMarkerid,
        };

        popupContent.push({
          id: thisMarkerid,
          popup_content: [],
        });
        break;
      }
    }

    var temp_popup_contents = [];

    for (let h in imageData) {
      if (parseInt(imageData[h].Markers_id) === thisMarkerid) {
        /* TODO: Add carousel slide order */

        if (imageData[h].widget_type_id === Widget_ID.CarouselWidget) {
          let temp_carousel_content = JSON.parse(imageData[h].content);
          imageData[h].content = JSON.stringify(
            temp_carousel_content.sort((a: any, b: any) => a.order_no - b.order_no)
          );
        }

        temp_popup_contents.push({
          id: imageData[h].Popup_Contents_id,
          widget_type_id: imageData[h].widget_type_id,
          order_no: imageData[h].order_no,
          src: imageData[h].content,
          marker_id: thisMarkerid,
        });
      }
    }

    popupContent[i]["popup_content"] = temp_popup_contents;
  }

  // Sorting popup contents by order_no
  for (let k in popupContent) {
    let content = popupContent[k].popup_content;
    // console.log(content);
    popupContent[k].popup_content = content.sort(function (a: any, b: any) {
      return parseInt(a.order_no) - parseInt(b.order_no);
    });
  }

  return [fetchedImage, popupContent];
}

export { ParseData };
