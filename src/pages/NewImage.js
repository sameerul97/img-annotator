import React from "react";
import ImageUploader from "react-images-upload";
import Select from "react-select";
import API from "../api";

class NewImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: [],
      bauerStations: [],
      selectedBauerStation: "",
      imageName: "",
      loading: false,
      error: false,
    };
    this.onDrop = this.onDrop.bind(this);
    this.onStationSelected = this.onStationSelected.bind(this);
    this.onImageNameChange = this.onImageNameChange.bind(this);
    this.createImage = this.createImage.bind(this);
  }

  getAllBauerStation = async (url) => {
    return new Promise((resolve, reject) => {
      API.get("/stations/", {
        params: {},
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (res.statusText) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  componentDidMount() {
    this.getAllBauerStation()
      .then((res) => {
        this.setState({ bauerStations: res });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onStationSelected = (selectedBauerStation) => {
    this.setState({
      selectedBauerStation: selectedBauerStation,
    });
  };

  onImageNameChange(e) {
    this.setState({
      imageName: e.target.value,
    });
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      selectedImage: pictureFiles,
    });
  }

  createImage() {
    const createImageInDb = async (category) => {
      try {
        this.setState({ loading: true });
        this.setState({ error: false });

        const formData = new FormData();

        formData.append("Stations_id", this.state.selectedBauerStation.id);
        formData.append("Users_id", 1);
        formData.append("name", this.state.imageName);
        formData.append("image", this.state.selectedImage[0]);

        let response = await API.post(`/image/`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 201) {
          this.setState({ loading: false });

          this.props.history.push(`/image/${response.data.image_id}`);
        }
      } catch (error) {
        this.setState({ loading: false });
        this.setState({ error: true });
      }

      return;
    };
    createImageInDb();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto mt-2">
            <ImageUploader
              withIcon={true}
              buttonText="Choose image"
              onChange={this.onDrop}
              imgExtension={[".jpeg", ".jpg", ".gif", ".png", ".gif", ".webp"]}
              maxFileSize={5242880}
              singleImage={true}
              withPreview={true}
              buttonClassName="btn-lg"
            />
          </div>
        </div>
        <div className="row rounded pt-3">
          <div className="col-md-8 shadow-sm rounded mx-auto pb-3">
            <div className="row">
              <div className="col-md-6">
                <p className="py-1">Select Station</p>
                <Select
                  defaultValue={this.state.selectedBauerStation}
                  onChange={this.onStationSelected}
                  options={this.state.bauerStations}
                />
              </div>
              <div className="col-md-6">
                <p className="py-1">Name</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Name"
                  value={this.state.imageName}
                  onChange={this.onImageNameChange}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.error && (
          <div className="row">
            <div className="my-2 w-50 mx-auto alert alert-danger" role="alert">
              Error, unable to create image. Try again!
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-8 mx-auto py-3 text-right">
            <button
              type="button"
              className="btn btn-info"
              onClick={this.createImage}
              disabled={
                !(
                  this.state.imageName !== "" &&
                  this.state.selectedBauerStation !== "" &&
                  this.state.selectedImage.length > 0 &&
                  this.state.loading === false
                )
              }
            >
              Create Image
            </button>
            {this.state.loading && (
              <div className="col-md-4 mx-auto py-5 text-right">
                <div className="spinner-border text-info" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default NewImage;
