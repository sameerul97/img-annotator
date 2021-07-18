![image-annotator](https://github.com/sameerul97/img-annotator/blob/master/app_showcase.gif?raw=true)
# image-annotator
Image Annotator lets you upload an image and place hotspot where each hotspot has popup which contains editable pre defined widgets. Image can embedded into websites (similar to how youtube lets you embed video into your personal site) [work in progress].

## How to run it locally
Git Clone or download the project locally and run docker compose to spin up all the required services.
Docker spins up PHP, Mysql and Adminer.

### Load default data
Log into Adminer (http://localhost:8080) using default credentials [username,password] = ["root","example"]  and execute all the sql statements found in img-annotator.sql inside Adminer execute option.

### Run React app
npm start and login into app using
email: test@testuser.com
password: test

## TODO
- Let user generate an embeddable link
- Introduce Redux
- Setup demo application with minimal setup


