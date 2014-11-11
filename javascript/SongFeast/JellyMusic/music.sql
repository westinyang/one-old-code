create database music;

/**
 * SQL for MySQL
 */

/**
 * 用户表
 */
create table user(
  /* 用户ID */
  id int(10) primary key auto_increment,
  /* 用户名 */
  user_name varchar(50) not null,
  /* 密码 */
  password varchar(50) not null,
  /* 昵称 */
  nick_name varchar(50) not null,
  /* 图片路径 */
  photo_url varchar(100),
  /* 真实名称 */
  real_name varchar(50) not null,
  /* 性别 */
  gender int(1) not null,
  /* 生日 */
  birthday date,
  /* 手机 */
  phone varchar(20),
  /* 电子邮箱 */
  email varchar(50),
  /* 地址 */
  address varchar(100),
  /* 注册时间 */
  register_date date not null
);

/**
 * 数据字典表
 */
create table dictionary(
  /* 字典ID */
  id int(10) primary key auto_increment,
  /* 字典名称 */
  name int(1) not null,
  /* 字典值 */
  value varchar(50) not null
);

/**
 * 歌手表
 */
create table singer(
  /* 歌手ID */
  id int(10) primary key auto_increment,
  /* 歌手名称 */
  name varchar(50) not null,
  /* 名称缩写 */
  abbreviate varchar(20) not null,
  /* 图片路径 */
  photo_url varchar(100),
  /* 歌手性别 */
  gender int(1) not null,
  /* 生日 */
  birthday date,
  /* 歌手描述 */
  description varchar(500),
  /* 歌手类别 */
  /* 外键 */
  type_id int(10) not null,
  /* 外键 */
  constraint fk_singer_dic foreign key (type) references dictionary(id)
);

/**
 * 歌曲表
 */
create table music(
  /* 歌曲ID */
  id int(10) primary key auto_increment,
  /* 歌曲名称 */
  name varchar(50) not null,
  /* 名称缩写 */
  abbreviate varchar(20) not null,
  /* 图片路径 */
  photo_url varchar(100),
  /* 音频路径 */
  audio_url varchar(100) not null,
  /* 歌词路径 */
  lyric_url varchar(100),
  /* 视频路径 */
  video_url varchar(100),
  /* 歌手ID */
  /* 外键 */
  singer_id int(10),
  /* 歌曲类别 */
  /* 外键 */
  type_id int(10) not null,
  /* 外键 */
  constraint fk_music_dic foreign key (type) references dictionary(id)
);

/**
 * 收藏表
 */
create table collection(
  /* 收藏ID */
  id int(10) primary key auto_increment,
  /* 图片路径 */
  photo_url varchar(100),
  /* 用户ID */
  /* 外键 */
  user_id int(10) not null,
  /* 歌手ID */
  /* 外键 */
  singer_id int(10),
  /* 歌曲ID */
  /* 外键 */
  music_id int(10),
  /* 收藏日期 */
  collect_date date not null,
  /* 外键 */
  constraint fk_collection_user foreign key (user_id) references user(id),
  /* 外键 */
  constraint fk_collection_singer foreign key (singer_id) references singer(id),
  /* 外键 */
  constraint fk_collection_music foreign key (music_id) references music(id)
);