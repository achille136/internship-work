DROP DATABASE IF EXISTS CRPMS;
CREATE DATABASE CRPMS;
USE CRPMS;

CREATE TABLE Services (
  ServiceCode VARCHAR(20) PRIMARY KEY,
  ServiceName VARCHAR(100) NOT NULL,
  ServicePrice DECIMAL(12,2) NOT NULL
);

CREATE TABLE Car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  Type VARCHAR(50) NOT NULL,
  Model VARCHAR(50) NOT NULL,
  ManufacturingYear INT NOT NULL,
  DriverPhone VARCHAR(20) NOT NULL,
  MechanicName VARCHAR(100) NOT NULL
);

-- No foreign keys to avoid blocking create/update/delete while learning
CREATE TABLE ServiceRecord (
  RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
  ServiceDate DATE NOT NULL,
  PlateNumber VARCHAR(20) NOT NULL,
  ServiceCode VARCHAR(20) NOT NULL
);

CREATE TABLE Payment (
  PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
  AmountPaid DECIMAL(12,2) NOT NULL,
  PaymentDate DATE NOT NULL,
  RecordNumber INT NOT NULL
);

INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES
('ENG01','Engine repair',150000),
('TRN01','Transmission repair',80000),
('OIL01','Oil Change',60000),
('CHN01','Chain replacement',40000),
('DSC01','Disc replacement',400000),
('WHE01','Wheel alignment',5000);

INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES
('RAF789V','Sedan','Benz',2020,'0781234567','Achille');
