![image-annotator](https://github.com/sameerul97/img-annotator/blob/master/app_showcase.gif?raw=true)

# image-annotator

Image Annotator lets you upload an image and place hotspot where each hotspot has popup which contains editable pre defined widgets. Image can embedded into websites (similar to how youtube lets you embed video into your personal site) [work in progress].

## How to run it locally

Git Clone or download the project locally and run docker compose to spin up all the required services.
Docker spins up PHP, Mysql and Adminer.

### Load default data

Log into Adminer (http://localhost:8080) using default credentials [username,password] = ["root","example"] and execute all the sql statements found in img-annotator.sql inside Adminer execute option.

### Run React app

npm start and login into app using
email: test@testuser.com
password: test

### Features implemented so far

- [x] Let user generate an embeddable link
- [x] Embed component uses React context
- [x] Implemented pagination using Redux
- [x] Drag and drop widgets from widgets panel into popup
- [x] Widgets in popup can be re ordered by the user
- [x] Widgets (Widgets are customisable)
  - [x] Image and Video widget
  - [x] Text (includes header, body, free text)
  - [x] Button (edit text and link out to external sources)
  - [x] Carousel Widget
    - [x] User can reorder slides via drag and drop
    - [x] User can add video / image slide
    - [x] User can edit each slide data (image, video and caption)

### TODO

- Rewrite editor component with Redux
- Setup demo application with minimal setup
