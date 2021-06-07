-- MySQL Script generated by MySQL Workbench
-- Sun Jan 17 18:26:03 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Img-annotator
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Img-annotator
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Img-annotator` DEFAULT CHARACTER SET utf8 ;
USE `Img-annotator` ;

-- -----------------------------------------------------
-- Table `Img-annotator`.`Stations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Img-annotator`.`Stations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Img-annotator`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Img-annotator`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Img-annotator`.`Images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Img-annotator`.`Images` (
  `id` INT AUTO_INCREMENT,
  `url` VARCHAR(255) NULL,
  `name` VARCHAR(255) NULL,
  `time` DATETIME NULL,
  `Stations_id` INT NOT NULL,
  `Users_id` INT NOT NULL,
  `last_modified` DATETIME NULL,
  PRIMARY KEY (`id`, `Users_id`),
  INDEX `fk_Images_Stations1_idx` (`Stations_id` ASC) VISIBLE,
  INDEX `fk_Images_Users1_idx` (`Users_id` ASC) VISIBLE,
  CONSTRAINT `fk_Images_Stations1`
    FOREIGN KEY (`Stations_id`)
    REFERENCES `Img-annotator`.`Stations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Images_Users1`
    FOREIGN KEY (`Users_id`)
    REFERENCES `Img-annotator`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Img-annotator`.`Markers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Img-annotator`.`Markers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `markerTop` VARCHAR(45) NULL,
  `markerLeft` VARCHAR(45) NULL,
  `color` VARCHAR(45) NULL,
  `animation_type` VARCHAR(45) NULL,
  `marker_type` VARCHAR(45) NULL,
  `Images_id` INT NOT NULL,
  `marker_image` VARCHAR(255) NULL,
  `background_color` VARCHAR(255) NULL,
  `border_radius` VARCHAR(255) NULL,
  `Markerscol` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Markers_Images_idx` (`Images_id` ASC) VISIBLE,
  CONSTRAINT `fk_Markers_Images`
    FOREIGN KEY (`Images_id`)
    REFERENCES `Img-annotator`.`Images` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Img-annotator`.`Popup_Contents`
-- -----------------------------------------------------
CREATE TABLE `Popup_Contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `widget_type_id` varchar(45) DEFAULT NULL,
  `content` varchar(45) DEFAULT NULL,
  `Markers_id` int(11) NOT NULL,
  `order_no` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Popup_Contents_Markers1_idx` (`Markers_id`),
  CONSTRAINT `fk_Popup_Contents_Markers1` FOREIGN KEY (`Markers_id`) REFERENCES `Markers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) 
ENGINE = InnoDB;


 
SELECT Images.id AS Image_Id,
Images.url,
Images.name,
Images.time,
Images.Stations_id,
Images.Users_id,
Images.last_modified, 
Markers.id AS Marker_id,
Markers.markerTop,
Markers.markerLeft,
Markers.color,
Markers.animation_type,
Markers.marker_type,
Markers.marker_image,
Markers.background_color,
Markers.border_radius,
Popup_Contents.id AS Popup_Contents_id,
Popup_Contents.widget_type_id,
Popup_Contents.content,
Popup_Contents.Markers_id,
Popup_Contents.order_no
FROM IMAGES 
	JOIN `Markers` ON Images.id = Markers.Images_id 
	JOIN `Popup_Contents` ON Popup_Contents.Markers_id = Markers.id 
WHERE IMAGES.id = 3;

