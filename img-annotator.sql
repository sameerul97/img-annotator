CREATE DATABASE `Img-annotator`;

CREATE TABLE `Img-annotator`.`Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `permission` varchar(11) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `Img-annotator`.`Users` (`id`, `username`, `email`, `password`, `permission`, `created_time`)
VALUES
	(1,'test_user','test@testuser.com','$2y$10$T45vxDTx6OmTFDDFFdvTCe/5pBYK/zcHTdX6rYzX7rhC.5PQFxmiG',NULL,'2021-01-20 13:30:13');

CREATE TABLE `Img-annotator`.`Stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `Img-annotator`.`Stations` (`id`, `name`)
VALUES
	(1,'test'),
	(3,'test2');


CREATE TABLE `Img-annotator`.`Images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `Stations_id` int(11) NOT NULL,
  `Users_id` int(11) NOT NULL,
  `last_modified` datetime DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`,`Users_id`),
  KEY `fk_Images_Stations1_idx` (`Stations_id`),
  KEY `fk_Images_Users1_idx` (`Users_id`),
  CONSTRAINT `fk_Images_Stations1` FOREIGN KEY (`Stations_id`) REFERENCES `Stations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Images_Users1` FOREIGN KEY (`Users_id`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT INTO `Img-annotator`.`Images` (`id`, `url`, `name`, `time`, `Stations_id`, `Users_id`, `last_modified`, `deleted`)
VALUES
	(3,'161132036832photo-1579126898112-0ea5054a86f6.jpeg','TEST','2021-01-22 12:59:28',1,1,NULL,0),
	(4,'161132069020photo-1611089384597-c4eaa6a19fef(1).jpeg','Test','2021-01-22 13:04:50',3,1,NULL,0),
	(8,'161133306926photo-1611077855004-cc0614011bd8.jpeg','Test','2021-01-22 16:31:09',1,1,NULL,0),
	(16,'161184955763samsung.gif','samsung ','2021-01-28 15:59:17',1,1,NULL,0),
	(17,'161185315432ezgif-6-1f467db0ae52.jpg','webp test','2021-01-28 16:59:14',3,1,NULL,0);


CREATE TABLE `Img-annotator`.`Markers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `markerTop` varchar(255) DEFAULT NULL,
  `markerLeft` varchar(255) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `animation_type` varchar(45) DEFAULT NULL,
  `marker_type` varchar(45) DEFAULT NULL,
  `Images_id` int(11) NOT NULL,
  `marker_image` varchar(255) DEFAULT NULL,
  `background_color` varchar(255) DEFAULT NULL,
  `border_radius` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Markers_Images_idx` (`Images_id`),
  CONSTRAINT `fk_Markers_Images` FOREIGN KEY (`Images_id`) REFERENCES `Images` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT INTO `Img-annotator`.`Markers` (`id`, `markerTop`, `markerLeft`, `color`, `animation_type`, `marker_type`, `Images_id`, `marker_image`, `background_color`, `border_radius`)
VALUES

	(30,'612.96092460099','1215.6026417171','#e91e63','','',3,'','',''),
	(31,'640.59387494805','1018.931197065','#e91e63','','',4,'','',''),
	(32,'835.38405975504','845.95854152409','#e91e63','','',8,'','',''),
	(67,'596.31399317406','263.7542662116','#e91e63','','',3,'','',''),
	(83,'151.9171423996','1177.3578535969','#e91e63','','',8,'','',''),
	(86,'912.16648879402','235.32550693703','#e91e63','','',3,'','',''),
	(91,'78.747435864968','531.54519208854','#e91e63','','',16,'','',''),
	(92,'273.42859675336','158.22401465461','#e91e63','','',16,'','',''),
	(93,'150.6083244397','518.67662753469','#e91e63','','',17,'','',''),
	(94,'155.21878335112','120.64034151547','#e91e63','','',17,'','',''),
	(97,'529.11183556633','1195.8315111518','#e91e63','','',8,'','',''),
	(106,'481.04286973231','233.16925126763','#e91e63','','',4,'','',''),
	(107,'892.55972696246','1800.409556314','#e91e63','','',4,'','','');


CREATE TABLE `Img-annotator`.`Popup_Contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `widget_type_id` varchar(255) DEFAULT NULL,
  `react_widget_id` varchar(255) DEFAULT NULL,
  `content` varchar(3000) DEFAULT NULL,
  `Markers_id` int(11) NOT NULL,
  `order_no` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Popup_Contents_Markers1_idx` (`Markers_id`),
  CONSTRAINT `fk_Popup_Contents_Markers1` FOREIGN KEY (`Markers_id`) REFERENCES `Markers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);


INSERT INTO `Img-annotator`.`Popup_Contents` (`id`, `widget_type_id`, `react_widget_id`, `content`, `Markers_id`, `order_no`)
VALUES
	(116,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum 2\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',30,0),
	(117,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum   Maxime? 2 as as at\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',30,1),
	(118,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',30,3),
	(119,'widget_id_2','widget_id_2','161584678646popup_image604fdd8224fc1.jpeg',31,0),
	(122,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',31,2),
	(123,'widget_id_2','widget_id_2','161217481915popup_image6017d5e3c418c.jpeg',32,1),
	(126,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test buttons\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',32,2),
 

	(324,'widget_id_2','widget_id_2','161217463424popup_image6017d52a0a21b.jpeg',83,0),
	(325,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":12,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":12,\"style\":\"\"},{\"offset\":0,\"length\":12,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":12,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',83,1),
	(326,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor n tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',83,2),
	(327,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"CLICK here\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://google.com\"}',83,3),

	(336,'widget_id_2','widget_id_2','161211644923popup_image6016f1e1edc79.jpeg',86,0),
	(337,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum ,newly added\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',86,2),
	(338,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',86,3),
	(339,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"CLICK HERE\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"http://google.com\"}',86,1),
	(356,'widget_id_2','widget_id_2','161584650362popup_image604fdc67be585.jpeg',91,0),
	(357,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum 2\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',91,1),
	(358,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',91,2),
	(359,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',91,3),
	(360,'widget_id_2','widget_id_2','162647372430Image5.jpeg',92,0),
	(361,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum 2\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',92,1),
	(362,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',92,2),
	(363,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',92,3),
	(364,'widget_id_2','widget_id_2','https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',93,0),
	(365,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum 2\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',93,1),
	(366,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',93,2),
	(367,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',93,3),
	(368,'widget_id_2','widget_id_2','https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',94,0),
	(369,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum 2\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',94,1),
	(370,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',94,2),
	(371,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',94,3),


	(395,'widget_id_2','widget_id_2_kkis3y0jnh9mzfnod6h','161850683416popup_image60787452f1da7.jpeg',67,1),
	(409,'widget_id_1','widget_id_1_kkljq2u8emuwkc7dldh','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorema empsum a\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":15,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":15,\"style\":\"\"},{\"offset\":0,\"length\":15,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":15,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',67,2),
	(411,'widget_id_1','widget_id_1_kkmfcdw8by7tl302qyc','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',32,0),
	(413,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum ,newly added\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',97,1),
	(414,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',97,2),
	(415,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',97,3),
	(450,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum ,newly added\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',106,1),
	(451,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',106,2),
	(452,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',106,3),
	(453,'widget_id_4','widget_id_4_kmazogh6ozmc7d7o07c','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://www.google.com/\"}',67,3),
	(454,'widget_id_2','widget_id_2','161584688847popup_image604fdde828dda.jpeg',107,1),
	(455,'widget_id_1','widget_id_1','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum ,newly added\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',107,0),
	(456,'widget_id_5','widget_id_5','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',107,2),
	(457,'widget_id_4','widget_id_4','{\"buttonTextSrc\":{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Some test button\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}},\"buttonUrlSrc\":\"https://unsplash.com/photos/hNSKX6sKWfk\"}',107,3),
	(462,'widget_id_3','widget_id_3_knhbasn84q1nh7nhchx','https://www.youtube.com/embed/-pdVUsCqd2U',106,0),
	(463,'widget_id_7','widget_id_7_knhots4g7cn5a7i91n','[{\"id\":\"1\",\"slide_type\":\"image\",\"src\":\"162005138048popup_image609005b44a3d4.jpeg\",\"order_no\":\"1\",\"caption\":\"         Slide 2 caption here\"},{\"id\":\"2\",\"slide_type\":\"image\",\"src\":\"162005187873photo-1509178630052-fb2fa8a64cde.jpeg\",\"order_no\":\"0\",\"caption\":\"Slide caption here\"},{\"id\":\"3\",\"slide_type\":\"video\",\"src\":\"https:\\/\\/www.youtube.com\\/embed\\/jWUlvAv0LOA\",\"order_no\":\"2\",\"caption\":\"carousel video slide caption\"},{\"id\":\"4\",\"slide_type\":\"video\",\"src\":\"https:\\/\\/www.youtube.com\\/embed\\/-pdVUsCqd2U\",\"order_no\":3,\"caption\":\"carousel video slide caption\"},{\"id\":\"5\",\"slide_type\":\"image\",\"src\":\"_popup_placeholder_image.png\",\"order_no\":4,\"caption\":\"carousel slide caption\"}]',30,2),
	(464,'widget_id_7','widget_id_7_knx3l84ga17dtu3qk8e','[{\"id\":\"1\",\"slide_type\":\"image\",\"src\":\"_popup_placeholder_image.png\",\"order_no\":\"0\",\"caption\":\"Carousel slide 1 caption\"},{\"id\":\"2\",\"slide_type\":\"image\",\"src\":\"_popup_placeholder_image.png\",\"order_no\":\"1\",\"caption\":\"Carousel slide 2 caption\"}]',97,0),
	(465,'widget_id_3','widget_id_3_ko7f75n4g246kxdthim','https://www.youtube.com/embed/-pdVUsCqd2U',67,0),
 
	(474,'widget_id_1','widget_id_1_kr6wnzhjv3o0hyh3tbh','{\"blocks\":[{\"key\":\"7pjmv\",\"text\":\"Lorem empsum\",\"type\":\"header-three\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":14,\"style\":\"color-rgb(52,58,64)\"},{\"offset\":0,\"length\":14,\"style\":\"\"},{\"offset\":0,\"length\":14,\"style\":\"fontsize-1.5rem\"},{\"offset\":0,\"length\":14,\"style\":\"fontfamily--apple-system, BlinkMacSystemFont, \\\"Segoe UI\\\", Roboto, \\\"Helvetica Neue\\\", Arial, \\\"Noto Sans\\\", sans-serif, \\\"Apple Color Emoji\\\", \\\"Segoe UI Emoji\\\", \\\"Segoe UI Symbol\\\", \\\"Noto Color Emoji\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"left\"}}],\"entityMap\":{}}',31,1);
